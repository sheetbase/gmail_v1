import { IGmailModule } from './types/module';

declare const gmailModuleExports: {(): IGmailModule};
const sheetbaseGmail = gmailModuleExports();
const SheetbaseGmail = sheetbaseGmail;
const SHEETBASE_GMAIL = sheetbaseGmail;

export { sheetbaseGmail, SheetbaseGmail, SHEETBASE_GMAIL };

export function sheetbase_gmail_example1(): void {
    const quota = SheetbaseGmail.quota();
    Logger.log(quota);
}

export function sheetbase_gmail_example2(): void {
    const email = SheetbaseGmail.send({
        recipient: '<email_address>',
        subject: 'Hello',
        options: {
            htmlBody: '<h1>Sheetbase</h1><p>Hello there!</p>'
        }
    });
    Logger.log(email);
}