import { ISheetbaseModule, IRoutingErrors, IAddonRoutesOptions, IHttpHandler } from '@sheetbase/core-server';
import { IGmailModule } from './types/module';
import { IMailingData } from './types/misc';

export const GMAIL_ROUTING_ERRORS: IRoutingErrors = {
    'mail/unknown': {
        status: 400, message: 'Unknown errors.',
    },
    'mail/no-mailing-data': {
        status: 400, message: 'No mailing data.',
    },
    'mail/no-recipient': {
        status: 400, message: 'No recipient.',
    }
};

export function gmailModuleRoutes(
    Sheetbase: ISheetbaseModule,
    SheetbaseGmail: IGmailModule,
    options: IAddonRoutesOptions 
): void {
    const customName: string = options.customName || 'mail';
    const middlewares: IHttpHandler[] = options.middlewares || ([
        (req, res, next) => next()
    ]);

    Sheetbase.Router.post('/' + customName, ... middlewares, (req, res) => {
        const mailingData: IMailingData = req.body.mailingData;
        const transporter: string = req.body.transporter;

        let result: any;
        try {
            result = SheetbaseGmail.send(mailingData, transporter);
        } catch (code) {
            const { status, message } = GMAIL_ROUTING_ERRORS[code];
            return res.error(code, message, status);
        }
        return res.success(result);
    });

    Sheetbase.Router.get('/' + customName + '/quota', ... middlewares, (req, res) => {
        let result: any;
        try {
            result = SheetbaseGmail.quota();
        } catch (code) {
            const { status, message } = GMAIL_ROUTING_ERRORS[code];
            return res.error(code, message, status);
        }
        return res.success(result);
    });
}