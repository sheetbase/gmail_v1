# Sheetbase Module: @sheetbase/gmail-server

Send email using Gmail in Sheetbase backend app.

<!-- <block:header> -->

[![License][license_badge]][license_url] [![clasp][clasp_badge]][clasp_url] [![Support me on Patreon][patreon_badge]][patreon_url] [![PayPal][paypal_donate_badge]][paypal_donate_url] [![Ask me anything][ask_me_badge]][ask_me_url]

<!-- </block:header> -->

## Install

- Using npm: `npm install --save @sheetbase/gmail-server`

- As a library: `1cKQyLf_OZwivLAiNBw-naLV_uq-lmf8AcOEnE9t5E9IQhA1Fo8JTV_sm`

  Set the _Indentifier_ to **Gmail** and select the lastest version, [view code](https://script.google.com/d/1cKQyLf_OZwivLAiNBw-naLV_uq-lmf8AcOEnE9t5E9IQhA1Fo8JTV_sm/edit?usp=sharing).

## Scopes

`https://www.googleapis.com/auth/gmail.send`

`https://www.googleapis.com/auth/script.send_mail`

## Examples

```ts
function example1(): void {
  const quota = Gmail.quota();
  Logger.log(quota);
}

function example2(): void {
  const email = Gmail.send({
    recipient: "<email_address>",
    subject: "Hello",
    options: {
      htmlBody: "<h1>Hello</h1><p>Gmail here!</p>"
    }
  });
  Logger.log(email);
}

function example3(): void {
  Logger.log("Not executable example.");
  /**
 *  expose routes
 *
    Gmail.registerRoutes();
 *
 */
}
```

## Documentation

See the docs: https://sheetbase.github.io/module-gmail-server

## API

An overview of the API, for detail please refer [the documentation](https://sheetbase.github.io/module-gmail-server).

### Gmail

```ts
export interface IModule {
  init(options?: IOptions): IModule;
  registerRoutes(options?: IAddonRoutesOptions): void;
  send(email: IMailingData, transporter?: string): IMailingData;
  quota(): { remainingDailyQuota: number };
}
```

## License

**@sheetbase/gmail-server** is released under the [MIT](https://github.com/sheetbase/module-gmail-server/blob/master/LICENSE) license.

<!-- <block:footer> -->

[license_badge]: https://img.shields.io/github/license/mashape/apistatus.svg
[license_url]: https://github.com/sheetbase/module-gmail-server/blob/master/LICENSE
[clasp_badge]: https://img.shields.io/badge/built%20with-clasp-4285f4.svg
[clasp_url]: https://github.com/google/clasp
[patreon_badge]: https://ionicabizau.github.io/badges/patreon.svg
[patreon_url]: https://www.patreon.com/lamnhan
[paypal_donate_badge]: https://ionicabizau.github.io/badges/paypal_donate.svg
[paypal_donate_url]: https://www.paypal.me/lamnhan
[ask_me_badge]: https://img.shields.io/badge/ask/me-anything-1abc9c.svg
[ask_me_url]: https://m.me/sheetbase

<!-- </block:footer> -->
