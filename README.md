# PCG REWARDS — Premium Static Portal

## Files
- `index.html`: static app shell for GitHub Pages
- `styles/variables.css`: centralized colors, depth, shadow and easing tokens
- `styles/app.css`: existing layout and premium motion layer
- `js/app.js`: existing authentication, wallet, catalogue and administrator application logic
- `js/motion-router.js`: hash navigation and animated administrator modules

## Deploy
1. Upload these files/folders to the root of `Tooler26/PCG-REWARDS-WEBSITE` and preserve the directory structure.
2. In GitHub, open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
3. Test account creation, sign-in, wallet updates, catalogue loading, shop applications and admin actions with test accounts before announcing launch.

## Security and production notes
- Never place service-role/secret keys in client-side files.
- Front-end hiding is not authorization: database policies and server-side functions must enforce account ownership and administrator privileges.
- Supplier catalogue display is separate from actual supplier fulfillment. Do not describe an order as completed unless the backend confirms it.
- This repository is a static front end; server-side validation, rate limits, audit logs and secure secrets must remain in backend functions.
- External animation/auth libraries load from their CDNs. A production deployment should pin and review dependencies.
