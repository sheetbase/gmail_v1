import { IModule as ISheetbaseModule, IRoutingErrors, IAddonRoutesOptions, IHttpHandler } from '@sheetbase/core-server';
import { IModule, IMailingData } from './types/module';

export const GMAIL_ROUTING_ERRORS: IRoutingErrors = {
    'mail/unknown': {
        status: 400, message: 'Unknown errors.',
    },
    'mail/missing': {
        status: 400, message: 'Missing inputs.',
    },
    'mail/no-recipient': {
        status: 400, message: 'No recipient.',
    }
};

export function gmailModuleRoutes(
    Sheetbase: ISheetbaseModule,
    Gmail: IModule,
    options: IAddonRoutesOptions = {}
): void {
    const customName: string = options.customName || 'mail';
    const middlewares: IHttpHandler[] = options.middlewares || ([
        (req, res, next) => next()
    ]);

    // send an email
    Sheetbase.Router.post('/' + customName, ... middlewares, (req, res) => {
        const mailingData: IMailingData = req.body.mailingData;
        const transporter: string = req.body.transporter;

        let result: any;
        try {
            result = Gmail.send(mailingData, transporter);
        } catch (code) {
            const { status, message } = GMAIL_ROUTING_ERRORS[code];
            return res.error(code, message, status);
        }
        return res.success(result);
    });

    // get daily quota
    Sheetbase.Router.get('/' + customName + '/quota', ... middlewares, (req, res) => {
        let result: any;
        try {
            result = Gmail.quota();
        } catch (code) {
            const { status, message } = GMAIL_ROUTING_ERRORS[code];
            return res.error(code, message, status);
        }
        return res.success(result);
    });
}