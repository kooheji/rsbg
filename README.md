# RuneScape Banner Generator

A self-hosted RuneScape 3 and Old School RuneScape banner generator for forum signatures, profile pages, and small embeds.

Live site: https://rsbg.kooheji.dev

GitHub: https://github.com/kooheji/rsbg

Support: https://ko-fi.com/kooheji

## Features

- Generate compact live stat banners for RS3 or OSRS.
- Generated embeds use game-specific dimensions: RS3 is `500x260`, OSRS is `400x270`.
- Fetches RuneScape HiScores through the included PHP endpoint, `proxy.php`.
- Static frontend with a small PHP backend, suitable for Apache/cPanel hosting.
- No Cloudflare Workers, Wrangler, Docker, Vercel, Netlify, or Node.js runtime required in production.
- Embed code can be copied from the generator UI.
- Open source under the MIT License. You can fork, modify, and host your own version.

## Production Files

Upload these files into your cPanel document root:

```txt
public_html/rsbg.kooheji.dev
```

Required files:

```txt
index.html
your-template.html
config.js
script.js
banner.js
style.css
proxy.php
.htaccess
icons/
LICENSE
```

Do not upload development-only files such as:

```txt
.DS_Store
dev-server.mjs
rsbg-cpanel-upload.zip
```

## cPanel Deployment

1. Create a subdomain in cPanel:

```txt
rsbg.kooheji.dev
```

2. Set the document root to:

```txt
public_html/rsbg.kooheji.dev
```

3. Upload the production files listed above.

4. Make sure PHP is enabled. PHP 7.4+ should work; PHP 8.x is preferred.

5. Confirm `config.js` points to your live site:

```js
window.RSBG_CONFIG = {
  SITE_URL: "https://rsbg.kooheji.dev",
  HISCORES_PROXY_URL: "/proxy.php"
};
```

6. Test the proxy:

```txt
https://rsbg.kooheji.dev/proxy.php?player=autarch&game=rs3
https://rsbg.kooheji.dev/proxy.php?player=hiddy&game=osrs
```

Both should return comma-separated HiScores data.

7. Test the standalone iframe templates:

```txt
https://rsbg.kooheji.dev/your-template.html?username=autarch&game=rs3&mode=icons
https://rsbg.kooheji.dev/your-template.html?username=hiddy&game=osrs&mode=icons
```

8. Open the generator:

```txt
https://rsbg.kooheji.dev
```

## HiScores Proxy

The browser does not call RuneScape HiScores directly. It calls:

```txt
/proxy.php?player={username}&game={rs3|osrs}
```

`proxy.php` performs the server-side request and returns the raw comma-separated HiScores response. This avoids browser CORS issues and keeps the app compatible with shared cPanel hosting.

If the proxy fails on cPanel, check that outbound HTTPS requests are allowed and that either PHP cURL or `allow_url_fopen` is enabled.

## Local Development

Production does not need Node.js. The optional local dev server exists only for previewing without PHP installed locally:

```bash
node dev-server.mjs 8083
```

Then open:

```txt
http://127.0.0.1:8083
```

## Support

If this tool helps you, you can support the project here:

https://ko-fi.com/kooheji

## Disclaimer

This site is not affiliated with RuneScape, Jagex, or the developers of RuneScape.

RuneScape and Old School RuneScape are trademarks of their respective owners.

## License

MIT License. See `LICENSE`.

You are free to fork, modify, and self-host this project.
