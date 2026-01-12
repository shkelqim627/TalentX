import { google } from 'googleapis';
import { ISheetGateway } from '../../domain/gateways/ISheetGateway';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export class GoogleSheetGateway implements ISheetGateway {
    private getSheetsClient() {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: SCOPES,
        });

        return google.sheets({ version: 'v4', auth });
    }

    async appendApplication(applicationData: any): Promise<void> {
        try {
            const sheetId = process.env.GOOGLE_SHEET_ID;
            if (!sheetId) {
                console.error('❌ GOOGLE_SHEET_ID is missing in .env!');
                return;
            }

            const sheets = this.getSheetsClient();

            const values = [
                [
                    new Date().toISOString(),
                    applicationData.full_name,
                    applicationData.email,
                    // Smart Role/Title Column: usage of specific title for talent, or 'Agency' for agency role
                    applicationData.role === 'agency' ? 'Agency' : (applicationData.title || 'N/A'),
                    applicationData.experience_years ? applicationData.experience_years.toString() : 'N/A', // Experience
                    applicationData.linkedin || 'N/A', // LinkedIn
                    applicationData.portfolio || 'N/A', // Portfolio
                    applicationData.agency_name || 'N/A',
                    applicationData.team_size ? applicationData.team_size.toString() : 'N/A', // Team Size
                    applicationData.company_website || 'N/A',
                    applicationData.linkedin_company_page || 'N/A',
                    applicationData.founded_year ? applicationData.founded_year.toString() : 'N/A',
                    applicationData.resume_url,
                    'pending'
                ]
            ];

            console.log(`Attempting to append to Google Sheet ID: ${sheetId}`);

            await sheets.spreadsheets.values.append({
                spreadsheetId: sheetId,
                range: 'Sheet1!A:N', // Extended range A-N
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values,
                },
            });

            console.log('✅ Successfully synced to Google Sheet');

        } catch (error: any) {
            console.error('❌ Google Sheet Sync Error:', error.message);
            if (error.response) {
                console.error('API Error Details:', JSON.stringify(error.response.data, null, 2));
            }
        }
    }
}
