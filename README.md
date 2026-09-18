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
4. The domain. tipsymonkey.com has been registered at DreamHost since 2003 (paid through June 2027), has Google mail records, and currently serves a three.js test page. Confirm it is theirs before planning on info@tipsymonkey.com or launching there.

## Notes

- The logo is Gary's pencil sketch (from "logo  pencil style.docx"). On the site it is recoloured cream on a transparent background as `site/assets/logo.png`, and the original is in `source/`. The browser tab and home-screen icons (`favicon.ico`, `assets/favicon-*.png`, `assets/apple-touch-icon.png`) are the monkey's head cropped from the same drawing.
- The look follows the sample Gary sent (`saved_resource.html`, a ChatGPT mockup for "869 Productions"): navy and gold, Playfair Display and Inter.
- The bios are Gary's text word for word, including his dashes.
- Founder photos are in `site/assets/team/` as 4:5 crops (Gary 880 x 1100, Emilio 960 x 1200). Gary's crop leaves out the child's photo and the framed picture on his shelves. Both are shown in black and white by CSS (`.portrait__frame img` in `styles.css`); delete that `filter` line to show Gary in color. If a file is missing, the page shows the founder's initials instead.
- Photos are free Unsplash images loaded from images.unsplash.com. The Unsplash License allows commercial use with no attribution. Swap in their own stills when they have them.
- The inquiry form has no server. Sending it opens the visitor's email app with the details filled in, addressed to info@tipsymonkey.com. DreamHost shared hosting runs PHP if they later want messages delivered without the visitor's email app.
- Scrolling is smoothed in `js/main.js`. Mouse-wheel input and in-page links glide, timed by the real frame interval so the glide is the same at 60, 120 or 144 Hz. Touch, keyboard and scrollbar stay native. The hero parallax runs on the CSS scroll timeline where supported (`animation-timeline`), with a JavaScript fallback elsewhere.
- For visitors who set reduced motion, the slow hero zoom, the grain and the scroll reveals switch off. The parallax, the REC blink, the timecode and the smooth scrolling stay on at Griffin's request.

## Deploy

GitHub Pages: every push to `main` publishes `site/` to https://mintykomodo.github.io/TipsyMonkey-/ through `.github/workflows/pages.yml` (Settings > Pages > Source is set to GitHub Actions). The page carries a `noindex` meta tag while it is a preview; delete that line in `site/index.html` at launch.

When `styles.css` or `main.js` changes, bump the `?v=` value on their tags in `index.html` so browsers stop using a cached copy.

DreamHost: upload the contents of `site/` to the domain's web directory over SFTP (usually `~/tipsymonkey.com/`). Any static host works the same way: Cloudflare Pages, GitHub Pages or Netlify.
