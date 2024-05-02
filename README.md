# Headless WooCommerce

This repo contains a demo for a detached WooCommerce store, using Store API, which is under-development and is included for free with WooCommerce and WooCommerce Blocks plugins.

## Limitations

- The demo doesn't support adding variable products, you can still add them in Store API.
- The demo requires [headless-helper-plugin](https://github.com/senadir/helper-headless-plugin), which adds Basic-stripe payment gateway, disables CORS, disables nonces, and attach stripe client secret to the checkout response.
- The demo requires samesite cookies to be disabled. You need to host it on the same domain as your WooCommerce instance or disable samesite by updating `wc_setcookie` in WooCommerce.

## Deploy your own

- Deploy to vercel.com or netlify or any other JAM host.
- Define your enviroment variables like the WooCommerce url and Stripe public key.
