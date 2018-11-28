import { ResponseError, RoutingErrors } from '@sheetbase/core-server';

import { MailingData, AddonRoutesOptions } from './types';
import { GmailService } from './gmail';

export const ROUTING_ERRORS: RoutingErrors = {
    'mail/unknown': { status: 500, message: 'Unknown errors.' },
    'mail/missing': { status: 400, message: 'Missing inputs.' },
    'mail/no-recipient': { status: 400, message: 'No recipient.' },
};

export function routingError(handler: {(err: ResponseError)}, code?: string) {
    code = ROUTING_ERRORS[code] ? code : 'mail/unknown';
    const { status, message } = ROUTING_ERRORS[code];
    return handler({ code, message, status });
}

function enableThisRoute(
    disabledRoutes: string | string[],
    method: string,
    routeName: string,
): boolean {
    return (disabledRoutes.indexOf(method + ':' + routeName) < 0 &&
        disabledRoutes.indexOf(method.toUpperCase() + ':' + routeName) < 0);
}

export function moduleRoutes(
    Gmail: GmailService, options: AddonRoutesOptions,
): void {
    if (!options.router) {
        throw new Error('No router, please check out for Sheetbase Router.');
    }

    const {
        router,
        endpoint = 'mail',
        disabledRoutes = [],
        middlewares = [(req, res, next) => next()],
    } = options;

    // get daily quota
    if (enableThisRoute(disabledRoutes, 'get', `/${endpoint}/quota`)) {
        router.get('/' + endpoint + '/quota', ... middlewares,
        (req, res) => {
            let result: any;
            try {
                result = Gmail.quota();
            } catch (code) {
                return routingError(res.error, code);
            }
            return res.success(result);
        });
    }

    // send an email
    if (enableThisRoute(disabledRoutes, 'post', `/${endpoint}`)) {
        router.post('/' + endpoint, ... middlewares,
        (req, res) => {
            const mailingData: MailingData = req.body.mailingData;
            const transporter: string = req.body.transporter;
            let result: any;
            try {
                result = Gmail.send(mailingData, transporter);
            } catch (code) {
                return routingError(res.error, code);
            }
            return res.success(result);
        });
    }

}