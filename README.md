# Sheetbase Module: gmail-server

Send email using Gmail in Sheetbase backend app.

# Install

- NPM: ``$ npm install --save @sheetbase/gmail-server``

- As library: ``1cKQyLf_OZwivLAiNBw-naLV_uq-lmf8AcOEnE9t5E9IQhA1Fo8JTV_sm`` (set Indentifier to **SheetbaseGmail**, [view code](https://script.google.com/d/1cKQyLf_OZwivLAiNBw-naLV_uq-lmf8AcOEnE9t5E9IQhA1Fo8JTV_sm/edit?usp=sharing))

## Usage

```ts
// expose module routes
SheetbaseGmail.registerRoutes(options?: IAddonRoutesOptions);

// get daily quota
const quota = SheetbaseGmail.quota();
Logger.log(quota);

// send an email
const email = SheetbaseGmail.send({
	recipient: '<email_address>',
	subject: 'Hello',
	options: {
		htmlBody: '<h1>Sheetbase</h1><p>Hello there!</p>'
	}
});
Logger.log(email);
```

```http
GET ?e=/mail/quota

Result: Error | Success = { "remainingDailyQuota": number }

POST ?e=/mail

{ "mailingData": Object }

Result: Error | Success = mailingData
```

## License

[MIT][license-url]

[license-url]: https://github.com/sheetbase/module-gmail-server/blob/master/LICENSE