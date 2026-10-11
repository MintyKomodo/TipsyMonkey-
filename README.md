# Tipsy Monkey Productions Website

Static site for Gary Colt and Emilio Gonzalez Moreno. No build step. Everything that goes on the web server is in `site/`.

Preview locally:

```
python -m http.server 4180 --directory site
```

## Still Needed From Gary

1. Upcoming projects. Replace the three placeholder cards in the Projects section of `site/index.html`: status, format and location, title, logline, and a poster or still.
2. Gary's IMDb URL. It is the "Gary Colt IMDb Profile" link in his 9/12 email. Paste it into `IMDB_URL` at the top of `site/js/main.js`. The IMDb button and footer link stay hidden until it is set.
3. The Delaware file number, if he wants it in the footer. There is a TODO in `site/index.html`.
4. A mailbox. The site writes to info@tipsymonkey.com (Griffin, 2026-10-11). That domain is registered at DreamHost since 2003 with Google mail records, so check the mailbox actually reaches them before the site goes public.

## Notes

- The logo is Gary's pencil sketch (from "logo  pencil style.docx"). On the site it is recoloured cream on a transparent background as `site/assets/logo.png`, and the original is in `source/`. The browser tab and home-screen icons (`favicon.ico`, `assets/favicon-*.png`, `assets/apple-touch-icon.png`) are the monkey's head cropped from the same drawing.
- The look follows the sample Gary sent (`saved_resource.html`, a ChatGPT mockup for "869 Productions"): navy and gold, Playfair Display and Inter.
- The bios are Gary's text word for word, including his dashes.
- Founder photos are in `site/assets/team/` as 4:5 crops (Gary 880 x 1100, Emilio 960 x 1200). Gary's crop leaves out the child's photo and the framed picture on his shelves. Both are shown in black and white by CSS (`.portrait__frame img` in `styles.css`); delete that `filter` line to show Gary in color. If a file is missing, the page shows the founder's initials instead.
- Photos are free Unsplash images loaded from images.unsplash.com. The Unsplash License allows commercial use with no attribution. Swap in their own stills when they have them.
- The inquiry form has no server. Sending it opens the visitor's email app with the details filled in, addressed to info@tipsymonkey.com. DreamHost shared hosting runs PHP if they later want messages delivered without the visitor's email app.
- Scrolling is smoothed in `js/main.js`. Mouse-wheel input and in-page links glide, timed by the real frame interval so the glide is the same at 60, 120 or 144 Hz. Touch, keyboard and scrollbar stay native. The hero parallax runs on the CSS scroll timeline where supported (`animation-timeline`), with a JavaScript fallback elsewhere.
- For visitors who set reduced motion, the slow hero zoom, the grain and the scroll reveals switch off. The parallax, the REC blink, the timecode and the smooth scrolling stay on at Griffin's request.

## Custom domain

Gary picked tipsymonkeyproductions.com (unregistered as of 2026-10-11). Once it is bought, in this order:

1. At the registrar, point the domain at GitHub Pages. Four A records on the root (`@`): 185.199.108.153, 185.199.109.153, 185.199.110.153 and 185.199.111.153. One CNAME on `www` pointing to `mintykomodo.github.io`.
2. Repo Settings > Pages > Custom domain: enter the domain and save, then wait for the certificate and tick Enforce HTTPS.
3. Add a `CNAME` file in `site/` holding just the domain, so the Actions deploy keeps serving it.
4. Delete the `noindex` meta tag in `site/index.html` so search engines can index the live site.

Doing step 2 before step 1 takes the mintykomodo.github.io preview link down, so keep the order.

## Deploy

GitHub Pages: every push to `main` publishes `site/` to https://mintykomodo.github.io/TipsyMonkey-/ through `.github/workflows/pages.yml` (Settings > Pages > Source is set to GitHub Actions). The page carries a `noindex` meta tag while it is a preview; delete that line in `site/index.html` at launch.

When `styles.css` or `main.js` changes, bump the `?v=` value on their tags in `index.html` so browsers stop using a cached copy.

GitHub Pages serves the site today. Any static host works the same way if that ever changes: Cloudflare Pages, Netlify or plain SFTP to a web directory.
