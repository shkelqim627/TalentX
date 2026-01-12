import { google } from 'googleapis';
import stream from 'stream';
import { IStorageGateway } from '../../domain/gateways/IStorageGateway';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

export class DriveStorageGateway implements IStorageGateway {
    private driveClient: any = null;

    private getDriveClient() {
        if (this.driveClient) return this.driveClient;

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: SCOPES,
        });

        this.driveClient = google.drive({ version: 'v3', auth });
        return this.driveClient;
    }

    async uploadFile(fileObject: Express.Multer.File, folderId: string = process.env.GOOGLE_DRIVE_FOLDER_ID || ''): Promise<string> {
        try {
            if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
                console.warn('Google Drive credentials not found. Returning mock URL.');
                return `https://mock-drive-url.com/${fileObject.filename}`;
            }

            const drive = this.getDriveClient();

            const bufferStream = new stream.PassThrough();
            bufferStream.end(fileObject.buffer);

            const response = await drive.files.create({
                requestBody: {
                    name: fileObject.originalname,
                    parents: folderId ? [folderId] : [],
                },
                media: {
                    mimeType: fileObject.mimetype,
                    body: bufferStream,
                },
                fields: 'id, webViewLink',
                supportsAllDrives: true,
            });

            if (!response.data.webViewLink) {
                // If webViewLink is missing (permissions?), return ID constructed link
                return `https://drive.google.com/file/d/${response.data.id}/view`;
            }

            return response.data.webViewLink;

        } catch (error: any) {
            console.error('Google Drive Upload Error Details:', {
                message: error.message,
                code: error.code,
                errors: error.errors
            });

            // Fallback to mock URL
            console.warn('Falling back to mock URL due to Drive upload failure.');
            return `https://mock-drive-url.com/fallback_${fileObject.filename}`;
        }
    }
}
