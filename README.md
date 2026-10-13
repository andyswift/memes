# memes!

A tiny meme generator with five classic formats: Yes / No, Distracted, Two Buttons, Big Brain and Change My Mind.
Pick one, type your joke, then copy the link or save the picture.

- **The link is the meme.** The format and your captions are encoded in the URL hash (`#v1.<base64url JSON>`), so there is no server, no database and no sign-up.
- **All art is original.** The five formats are drawn in code from simple shapes (`src/templates.js`), not copied from the well-known photos.
- **Plain JavaScript.** Vite + vanilla JS + canvas. Pictures are rendered at 1000 x 1000 and saved as PNG (or sent through the share sheet on phones).

## Develop

```
npm install
npm run dev      # play locally
npm run build    # static build in dist/ (relative paths, works from a subfolder)
npm test         # share-link and text-layout tests
```

## Add a format

Add an object to `src/templates.js`: an `id`, a button `color`, a square `size` in design units, the text `slots`, and a `draw(api, texts)` function that uses the small drawing API from `src/render.js` (`rect`, `circle`, `path`, `text`, ...).

## Licence

MIT.
