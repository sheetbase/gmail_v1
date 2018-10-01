import { ISheetbaseModule, IAddonRoutesOptions } from '@sheetbase/core-server';
import { IGmailModule } from './module';

export interface IGmailModuleRoutes {
    (
        Sheetbase: ISheetbaseModule,
        SheetbaseGmail: IGmailModule,
        options?: IAddonRoutesOptions
    ): void
}

export interface IMailingData {
    recipient: string;
    subject?: string;
    body?: string;
    options?: {
        attachments?: any[];
        bcc?: string;
        cc?: string;
        from?: string;
        htmlBody?: string;
        inlineImages?: Object;
        name?: string;
        noReply?: boolean;
        replyTo?: string;
    }
}