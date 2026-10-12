# Give It A Good Name: perfume website
Static site, no build step.
**Run locally:** `npx serve .` (or `python3 -m http.server`) then open the shown address.
**Edit details:** `js/config.js` (WhatsApp number in 233XXXXXXXXX format, socials, email, location, delivery, payment). Every REPLACE must be changed.
**Edit perfumes/prices/images:** `js/products.js`. Put photos in `assets/images/` and set `image: "assets/images/name.jpg"`. Empty image shows a drawn bottle.
**Deploy to Vercel:** push the folder to GitHub, then Vercel > Add New Project > import it. Framework: Other, no build command, output directory: root. Or run `npx vercel` in this folder.
**Before launch:** real WhatsApp number, socials, email, location, delivery and payment info, product photos and prices, og-image.jpg (1200x630).
