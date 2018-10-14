import { IRoutingErrors, IAddonRoutesOptions, IRouteHandler, IRouter, IRouteResponse } from '@sheetbase/core-server';
import { IModule, IMailingData } from './types/module';

export const ROUTING_ERRORS: IRoutingErrors = {
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

function routingError(res: IRouteResponse, code: string) {
    const error = ROUTING_ERRORS[code] || ROUTING_ERRORS['mail/unknown'];
    const { status, message } = error;
    return res.error(code, message, status);
}

export function gmailModuleRoutes(Gmail: IModule, Router: IRouter, options: IAddonRoutesOptions = {}): void {
    if (!Router) {
        throw new Error('No router, please check out for Sheetbase Router.');
    }
    const endpoint: string = options.endpoint || 'mail';
    const middlewares: IRouteHandler[] = options.middlewares || ([
        (req, res, next) => next()
    ]);

    // send an email
    Router.post('/' + endpoint, ... middlewares, (req, res) => {
        let result: any;
        try {
            const mailingData: IMailingData = req.body.mailingData;
            const transporter: string = req.body.transporter;
            result = Gmail.send(mailingData, transporter);
        } catch (code) {
            return routingError(res, code);
        }
        return res.success(result);
    });

    // get daily quota
    Router.get('/' + endpoint + '/quota', ... middlewares, (req, res) => {
        let result: any;
        try {
            result = Gmail.quota();
        } catch (code) {
            return routingError(res, code);
        }
        return res.success(result);
    });
}