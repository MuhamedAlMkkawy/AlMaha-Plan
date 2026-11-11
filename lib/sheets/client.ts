import { google, sheets_v4 } from 'googleapis';

export interface GoogleSheetsClientConfig {
  clientEmail?: string;
  privateKey?: string;
  sheetId: string;
}

let cachedClient: sheets_v4.Sheets | null = null;

export function getGoogleSheetsClient(config?: Partial<GoogleSheetsClientConfig>): sheets_v4.Sheets | null {
  const email = config?.clientEmail || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = config?.privateKey || process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !privateKey) {
    return null;
  }

  // Handle escaped \n in environment variables
  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  if (cachedClient) {
    return cachedClient;
  }

  try {
    const auth = new google.auth.JWT({
      email,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    cachedClient = google.sheets({ version: 'v4', auth });
    return cachedClient;
  } catch (err) {
    console.error('[GoogleSheetsClient] Error creating auth client:', err);
    return null;
  }
}

