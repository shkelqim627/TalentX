import { google } from 'googleapis';
import path from 'path';
import dotenv from 'dotenv';

// Load env vars from server root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const SCOPES = ['https://www.googleapis.com/auth/drive'];

const getDriveClient = () => {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: SCOPES,
    });
    return google.drive({ version: 'v3', auth });
};

const convertToSheet = async (fileId: string) => {
    try {
        console.log(`Converting file ${fileId} to Google Sheet...`);
        const drive = getDriveClient();

        const response = await drive.files.copy({
            fileId: fileId,
            requestBody: {
                name: 'TalentX Applications (Converted)', // New Name
                mimeType: 'application/vnd.google-apps.spreadsheet', // Magic conversion line
            },
        });

        const newId = response.data.id;
        console.log('✅ Conversion Successful!');
        console.log(`New Google Sheet ID: ${newId}`);
        console.log(`New URL: https://docs.google.com/spreadsheets/d/${newId}`);

    } catch (error: any) {
        console.error('❌ Conversion Failed:', error.message);
        if (error.response) {
            console.error('Details:', error.response.data);
        }
    }
};

// The ID provided by the user
const EXCEL_ID = '1UoY4eRRiwYjP04MfgKpGHciCANrq-Otw';
convertToSheet(EXCEL_ID);
