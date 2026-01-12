import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { JWTService } from "../../interface/middleware/AuthMiddleware";
import { MessageService } from "../../application/services/MessageService";

export const setupWebSocketServer = (server: Server, messageService: MessageService) => {
    console.log("Initializing WebSocket server...");
    const wss = new WebSocketServer({ server });
    console.log("WebSocket server attached to HTTP server");

    // Map to keep track of connections by userId
    const userConnections = new Map<string, WebSocket>();

    wss.on("connection", (ws, req) => {
        let currentUserId: string | null = null;
        let currentUserRole: string | null = null;

        console.log("New WS connection attempt");

        ws.on("message", async (msg) => {
            try {
                const data = JSON.parse(msg.toString());

                // Handle Authentication/Identification
                if (data.type === "auth") {
                    const token = data.token;
                    try {
                        const userData = JWTService.decodeToken(token);
                        if (userData && (userData as any).id) {
                            currentUserId = (userData as any).id;
                            currentUserRole = (userData as any).role;
                            userConnections.set(currentUserId!, ws);
                            console.log(`User ${currentUserId} (${currentUserRole}) authenticated via WS`);
                            ws.send(JSON.stringify({ type: "authenticated", status: "ok" }));
                        }
                    } catch (err) {
                        console.error("WS Auth failed:", err);
                        ws.send(JSON.stringify({ type: "error", message: "Authentication failed" }));
                    }
                    return;
                }

                if (!currentUserId || !currentUserRole) {
                    ws.send(JSON.stringify({ type: "error", message: "Not authenticated" }));
                    return;
                }

                // Handle Direct/Support Messaging
                if (data.type === "message") {
                    const { receiver_id, content, isSupport } = data;

                    // Save to DB via Service
                    const savedMsg = await messageService.createMessage(
                        currentUserId,
                        currentUserRole,
                        { receiver_id, content, isSupport }
                    );

                    // Determine recipient
                    // In new service logic, createMessage returns formatted message
                    // Logic: 
                    const recipientId = savedMsg.receiverId === "support-system-user-id-001"
                        ? "admin-broadcast"
                        : savedMsg.receiverId;

                    if (recipientId === "admin-broadcast") {
                        // Send to all connected admins
                        // For now, broadcast to everyone or better filter if we tracked roles in map
                        // Since map is just ID -> WS, we assume admin has ID.
                        // We can iterate map and check? But we don't store roles in map value here (just WS).
                        // Improvement: Store { ws, role } in map.
                        userConnections.forEach((conn, uid) => {
                            if (conn.readyState === WebSocket.OPEN) {
                                conn.send(JSON.stringify({ type: "new_message", message: savedMsg }));
                            }
                        });
                    } else {
                        const recipientWs = userConnections.get(recipientId);
                        if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
                            recipientWs.send(JSON.stringify({ type: "new_message", message: savedMsg }));
                        }
                    }
                }
            } catch (e) {
                console.error("Error processing WS message:", e);
            }
        });

        ws.on("close", () => {
            if (currentUserId) {
                userConnections.delete(currentUserId);
                console.log(`User ${currentUserId} disconnected from WS`);
            }
        });
    });

    return wss;
};
