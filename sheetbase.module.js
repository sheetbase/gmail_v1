var exports = exports || {};
var module = module || { exports: exports };
/**
 * Sheetbase module
 * Name: @sheetbase/gmail-server
 * Export name: Gmail
 * Description: Send email using Gmail in Sheetbase backend app.
 * Version: 0.0.2
 * Author: Sheetbase
 * Homepage: https://sheetbase.net
 * License: MIT
 * Repo: https://github.com/sheetbase/module-gmail-server.git
 */

function GmailModule() {
    // import { IModule as ISheetbaseModule, IAddonRoutesOptions } from '@sheetbase/core-server';
    // import { IMailingData } from './types/module';
    // import { gmailModuleRoutes } from './routes';
    var Gmail = /** @class */ (function () {
        function Gmail() {
        }
        Gmail.prototype.registerRoutes = function (Sheetbase, options) {
            gmailModuleRoutes(Sheetbase, this, options);
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
    // import { IModule as ISheetbaseModule, IRoutingErrors, IAddonRoutesOptions, IHttpHandler } from '@sheetbase/core-server';
    // import { IModule, IMailingData } from './types/module';
    var GMAIL_ROUTING_ERRORS = {
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
    function gmailModuleRoutes(Sheetbase, Gmail, options) {
        if (options === void 0) { options = {}; }
        var _a, _b;
        var customName = options.customName || 'mail';
        var middlewares = options.middlewares || ([
            function (req, res, next) { return next(); }
        ]);
        // send an email
        (_a = Sheetbase.Router).post.apply(_a, ['/' + customName].concat(middlewares, [function (req, res) {
                var mailingData = req.body.mailingData;
                var transporter = req.body.transporter;
                var result;
                try {
                    result = Gmail.send(mailingData, transporter);
                }
                catch (code) {
                    var _a = GMAIL_ROUTING_ERRORS[code], status = _a.status, message = _a.message;
                    return res.error(code, message, status);
                }
                return res.success(result);
            }]));
        // get daily quota
        (_b = Sheetbase.Router).get.apply(_b, ['/' + customName + '/quota'].concat(middlewares, [function (req, res) {
                var result;
                try {
                    result = Gmail.quota();
                }
                catch (code) {
                    var _a = GMAIL_ROUTING_ERRORS[code], status = _a.status, message = _a.message;
                    return res.error(code, message, status);
                }
                return res.success(result);
            }]));
    }
    // import { IModule } from './types/module';
    // import { Gmail } from './gmail';
    var moduleExports = new Gmail();
    return moduleExports || {};
}
exports.GmailModule = GmailModule;
// add to the global namespace
var proccess = proccess || this;
proccess['Gmail'] = GmailModule();
