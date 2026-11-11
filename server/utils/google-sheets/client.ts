import { google, sheets_v4 } from 'googleapis';

export interface GoogleSheetsConfig {
  clientEmail?: string;
  privateKey?: string;
  sheetId: string;
}

let cachedSheetsInstance: sheets_v4.Sheets | null = null;

export class GoogleSheetsClient {
  private static getAuthClient(email: string, privateKey: string) {
    let cleanKey = privateKey;
    if (cleanKey.includes('\\n')) {
      cleanKey = cleanKey.replace(/\\n/g, '\n');
    }
    return new google.auth.JWT({
      email,
      key: cleanKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  }

  public static getClient(config?: Partial<GoogleSheetsConfig>): sheets_v4.Sheets | null {
    if (cachedSheetsInstance) {
      return cachedSheetsInstance;
    }

    const email = config?.clientEmail || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = config?.privateKey || process.env.GOOGLE_PRIVATE_KEY;

    if (!email || !key) {
      return null;
    }

    try {
      const auth = this.getAuthClient(email, key);
      cachedSheetsInstance = google.sheets({ version: 'v4', auth });
      return cachedSheetsInstance;
    } catch (error) {
      console.error('[GoogleSheetsClient] Failed to initialize Google Sheets client:', error);
      return null;
    }
  }

  /**
   * Execute Google Sheets API operation with retry on rate limit or transient errors
   */
  public static async executeWithRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
    let delay = 1000;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        const status = error?.status || error?.response?.status || error?.code;
        const isTransient = status === 429 || status === 500 || status === 503;

        if (attempt === maxRetries || !isTransient) {
          throw error;
        }

        console.warn(`[GoogleSheetsClient] Transient error (${status}). Retrying attempt ${attempt}/${maxRetries} in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
    throw new Error('[GoogleSheetsClient] Max retries exceeded');
  }

  /**
   * Fetch values from a range using FORMATTED_VALUE
   */
  public static async getValues(spreadsheetId: string, range: string): Promise<string[][]> {
    const sheets = this.getClient();
    if (!sheets) {
      throw new Error('Google Sheets client not initialized (missing service account credentials)');
    }

    const response = await this.executeWithRetry(() =>
      sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
        valueRenderOption: 'FORMATTED_VALUE',
        dateTimeRenderOption: 'FORMATTED_STRING',
      })
    );

    return (response.data.values as string[][]) || [];
  }

  /**
   * Update values in a specific range using USER_ENTERED
   */
  public static async updateValues(spreadsheetId: string, range: string, values: any[][]): Promise<void> {
    const sheets = this.getClient();
    if (!sheets) {
      throw new Error('Google Sheets client not initialized');
    }

    await this.executeWithRetry(() =>
      sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values },
      })
    );
  }

  /**
   * Append rows to a sheet
   */
  public static async appendValues(spreadsheetId: string, range: string, values: any[][]): Promise<void> {
    const sheets = this.getClient();
    if (!sheets) {
      throw new Error('Google Sheets client not initialized');
    }

    await this.executeWithRetry(() =>
      sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values },
      })
    );
  }

  /**
   * Ensure tab exists or create it
   */
  public static async ensureTabExists(spreadsheetId: string, tabName: string): Promise<void> {
    const sheets = this.getClient();
    if (!sheets) return;

    try {
      const meta = await this.executeWithRetry(() =>
        sheets.spreadsheets.get({
          spreadsheetId,
          fields: 'sheets.properties.title',
        })
      );

      const exists = meta.data.sheets?.some((s) => s.properties?.title === tabName);
      if (!exists) {
        await this.executeWithRetry(() =>
          sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
              requests: [
                {
                  addSheet: {
                    properties: { title: tabName },
                  },
                },
              ],
            },
          })
        );
      }
    } catch (err) {
      console.warn(`[GoogleSheetsClient] Error checking/creating tab ${tabName}:`, err);
    }
  }
}

