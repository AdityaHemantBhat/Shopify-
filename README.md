# Shopify Announcement Banner App 🚀

Hey! This is a full-stack Shopify App. Basically, it lets store owners create a slick, custom announcement banner (like "Free Shipping!") from their Shopify Admin dashboard, and then it automatically displays that banner on their actual storefront using a Shopify App Embed.

## What's inside?
- **Frontend (React)**: The UI inside the Shopify Admin where merchants type out their announcements.
- **Backend (Node.js/Express)**: Handles saving the announcements to our MongoDB database and syncing them with Shopify.
- **Extension (Liquid/CSS)**: The actual banner code that gets injected into the storefront theme.

## How to run it locally 💻
If you want to test the app on your computer:
1. Make sure you have your `.env` file set up with your Shopify API keys and MongoDB URL.
2. Open your terminal in this folder.
3. Run `npm install` to get all the packages.
4. Run `npm run dev`. This will start the Shopify CLI, run the local server, and give you a link to install it on your test store!

## How to deploy it 🌍
If you want to put this live on the internet (like on Render):
1. **Host the Web App**: Point Render (or your host) to this repo. Set the root folder to `web`. Make sure the build command is `npm install && npm run build` and the start command is `npm run start`.
   - *Wait, how does Render run the frontend?* In production, your React frontend gets compiled into plain static files during the build step. Your Node.js backend is actually configured to serve these files! So Render only needs to run the backend server, and it will handle showing the frontend to users automatically.
2. **Publish the Banner**: In your terminal, run `npm run deploy` from the root folder. This pushes the storefront banner extension straight to Shopify so merchants can turn it on!
