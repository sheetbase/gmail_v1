import {
    RoutingErrors,
    AddonRoutesOptions,
    RouteHandler,
    RouteResponse,
} from '@sheetbase/core-server';

import { MailingData } from './types';
import { GmailService } from './gmail';

export const ROUTING_ERRORS: RoutingErrors = {
    'mail/unknown': {
        status: 400, message: 'Unknown errors.',
    },
    'mail/missing': {
        status: 400, message: 'Missing inputs.',
    },
    'mail/no-recipient': {
        status: 400, message: 'No recipient.',
    },
};

function routingError(res: RouteResponse, code: string) {
    const error = ROUTING_ERRORS[code] || ROUTING_ERRORS['mail/unknown'];
    const { status, message } = error;
    return res.error(code, message, status);
}

export function moduleRoutes(
    Gmail: GmailService,
    options: AddonRoutesOptions = {},
): void {
    const { router: Router, disabledRoutes } = Gmail.getOptions();

    if (!Router) {
        throw new Error('No router, please check out for Sheetbase Router.');
    }
    const endpoint: string = options.endpoint || 'mail';
    const middlewares: RouteHandler[] = options.middlewares || ([
        (req, res, next) => next(),
    ]);

    if (disabledRoutes.indexOf('post:' + endpoint) < 0) {
        // send an email
        Router.post('/' + endpoint, ... middlewares, (req, res) => {
            let result: any;
            try {
                const mailingData: MailingData = req.body.mailingData;
                const transporter: string = req.body.transporter;
                result = Gmail.send(mailingData, transporter);
            } catch (code) {
                return routingError(res, code);
            }
            return res.success(result);
        });
    }

    if (disabledRoutes.indexOf('get:' + endpoint + '/quota') < 0) {
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
}