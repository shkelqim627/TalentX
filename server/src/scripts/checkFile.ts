import { google } from 'googleapis';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];

const checkMimeType = async () => {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: SCOPES,
        });
        const drive = google.drive({ version: 'v3', auth });

        const fileId = '1UoY4eRRiwYjP04MfgKpGHciCANrq-Otw';
        const response = await drive.files.get({
            fileId: fileId,
            fields: 'name, mimeType',
        });

        console.log('File Metadata:');
        console.log(`Name: ${response.data.name}`);
        console.log(`MIME Type: ${response.data.mimeType}`);

    } catch (error: any) {
        console.error('Error checking file:', error.message);
    }
};

checkMimeType();
