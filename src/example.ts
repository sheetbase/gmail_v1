import { IModule as ISheetbaseModule } from '@sheetbase/core-server';
import { IModule } from './types/module';

declare const Sheetbase: ISheetbaseModule;

var proccess = proccess || this;
declare const GmailModule: {(): IModule};
const Gmail: IModule = proccess['Gmail'] || GmailModule();

export function example1(): void {
    const quota = Gmail.quota();
    Logger.log(quota);
}

export function example2(): void {
    const email = Gmail.send({
        recipient: '<email_address>',
        subject: 'Hello',
        options: {
            htmlBody: '<h1>Hello</h1><p>Gmail here!</p>'
        }
    });
    Logger.log(email);
}

// expose routes
export function example3(): void {
    Gmail.registerRoutes(Sheetbase);
}
