# RuneScape Banner Generator

A self-hosted RuneScape 3 and Old School RuneScape signature banner generator for forums, profiles, and small embeds.

Live site: https://rsbg.kooheji.dev

## Features

- Generate compact live stat banners for RuneScape 3 and Old School RuneScape.
- Embeddable output using `signature.html`.
- Real HiScores data fetched through the included `proxy.php` endpoint.
- Static frontend with a small PHP backend.
- Compatible with standard PHP/cPanel hosting.
- RS3-inspired and OSRS-inspired banner designs.
- Copyable iframe embed code.
- Open source and fork-friendly.

## Self-Hosting

Upload the project files to any PHP-enabled web host or cPanel site.

Required files:

```txt
index.html
signature.html
config.js
script.js
banner.js
style.css
proxy.php
.htaccess
icons/
LICENSE
```

Update `config.js` if you host the project on a different domain:

```js
window.RSBG_CONFIG = {
  SITE_URL: "https://your-domain.example",
  HISCORES_PROXY_URL: "/proxy.php"
};
```

The app should then load from your site root, and generated iframe embeds will point to:

```txt
https://your-domain.example/signature.html?username=player&game=rs3
```

## Screenshots

Screenshots coming soon.

## Fork This Project

Fork, modify, and self-host your own version:

https://github.com/kooheji/rsbg

## Support

If this project is useful, you can support it here:

https://ko-fi.com/kooheji

## Disclaimer

This site is not affiliated with RuneScape, Jagex, or the developers of RuneScape.

RuneScape and Old School RuneScape are trademarks of their respective owners.

## License

MIT License. See `LICENSE`.
