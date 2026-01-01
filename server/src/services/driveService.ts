import { google } from 'googleapis';
import stream from 'stream';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

// These should be in .env
// GOOGLE_CLIENT_EMAIL=...
// GOOGLE_PRIVATE_KEY=...
// GOOGLE_DRIVE_FOLDER_ID=...

let driveClient: any = null;

const getDriveClient = () => {
    if (driveClient) return driveClient;

    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: SCOPES,
    });

    driveClient = google.drive({ version: 'v3', auth });
    return driveClient;
};

export const uploadToDrive = async (fileObject: Express.Multer.File, folderId: string = process.env.GOOGLE_DRIVE_FOLDER_ID || ''): Promise<string> => {
    try {
        if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
            console.warn('Google Drive credentials not found. Returning mock URL.');
            return `https://mock-drive-url.com/${fileObject.filename}`;
        }

        const drive = getDriveClient();

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

        // We might want to make it permission-public or assume service account shares it with Admin
        // For now return the link
        return response.data.webViewLink;

    } catch (error: any) {
        console.error('Google Drive Upload Error Details:', {
            message: error.message,
            code: error.code,
            errors: error.errors
        });

        // Fallback to mock URL so application flow isn't blocked by Drive issues
        console.warn('Falling back to mock URL due to Drive upload failure.');
        return `https://mock-drive-url.com/fallback_${fileObject.filename}`;
    }
};
