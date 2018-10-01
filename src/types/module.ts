import { IAddonRoutesOptions } from '@sheetbase/core-server';
import { IMailingData } from './misc';

export interface IGmailModule {
    registerRoutes: {(options?: IAddonRoutesOptions): void};
    send: {(email: IMailingData, transporter?: string): IMailingData};
    quota: {(): {remainingDailyQuota: number} };
}