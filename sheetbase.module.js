var exports = exports || {};
var module = module || { exports: exports };
/**
 * Sheetbase module
 * Name: @sheetbase/gmail-server
 * Export name: Gmail
 * Description: Send email using Gmail in Sheetbase backend app.
 * Version: 0.0.3
 * Author: Sheetbase
 * Homepage: https://sheetbase.net
 * License: MIT
 * Repo: https://github.com/sheetbase/module-gmail-server.git
 */

function GmailModule(options) {
    // import { IAddonRoutesOptions } from '@sheetbase/core-server';
    // import { IModule, IMailingData, IOptions } from '../index';
    // import { gmailModuleRoutes } from './routes';
    var Gmail = /** @class */ (function () {
        function Gmail(options) {
            this.init(options);
        }
        Gmail.prototype.init = function (options) {
            this._options = options;
            return this;
        };
        Gmail.prototype.registerRoutes = function (options) {
            gmailModuleRoutes(this, this._options.router, options);
        };
        Gmail.prototype.send = function (mailingData, transporter) {
            if (transporter === void 0) { transporter = 'gmail'; }
            if (!mailingData) {
                throw new Error('mail/missing');
            }
            if (!mailingData.recipient) {
                throw new Error('mail/no-recipient');
            }
            (transporter === 'mailapp' ? MailApp : GmailApp).sendEmail(mailingData.recipient, mailingData.subject || 'Sheetbase Email', mailingData.body || 'Sheetbase email content ...', mailingData.options || {});
            return mailingData;
        };
        Gmail.prototype.quota = function () {
            var remainingDailyQuota = MailApp.getRemainingDailyQuota();
            return { remainingDailyQuota: remainingDailyQuota };
        };
        return Gmail;
    }());
    // import { IRoutingErrors, IAddonRoutesOptions, IRouteHandler, IRouter, IRouteResponse } from '@sheetbase/core-server';
    // import { IModule, IMailingData } from './types/module';
    var ROUTING_ERRORS = {
        'mail/unknown': {
            status: 400, message: 'Unknown errors.'
        },
        'mail/missing': {
            status: 400, message: 'Missing inputs.'
        },
        'mail/no-recipient': {
            status: 400, message: 'No recipient.'
        }
    };
    function routingError(res, code) {
        var error = ROUTING_ERRORS[code] || ROUTING_ERRORS['mail/unknown'];
        var status = error.status, message = error.message;
        return res.error(code, message, status);
    }
    function gmailModuleRoutes(Gmail, Router, options) {
        if (options === void 0) { options = {}; }
        if (!Router) {
            throw new Error('No router, please check out for Sheetbase Router.');
        }
        var endpoint = options.endpoint || 'mail';
        var middlewares = options.middlewares || ([
            function (req, res, next) { return next(); }
        ]);
        // send an email
        Router.post.apply(Router, ['/' + endpoint].concat(middlewares, [function (req, res) {
                var result;
                try {
                    var mailingData = req.body.mailingData;
                    var transporter = req.body.transporter;
                    result = Gmail.send(mailingData, transporter);
                }
                catch (code) {
                    return routingError(res, code);
                }
                return res.success(result);
            }]));
        // get daily quota
        Router.get.apply(Router, ['/' + endpoint + '/quota'].concat(middlewares, [function (req, res) {
                var result;
                try {
                    result = Gmail.quota();
                }
                catch (code) {
                    return routingError(res, code);
                }
                return res.success(result);
            }]));
    }
    var moduleExports = new Gmail(options);
    return moduleExports || {};
}
exports.GmailModule = GmailModule;
// add 'Gmail' to the global namespace
(function (process) {
    process['Gmail'] = GmailModule();
})(this);
