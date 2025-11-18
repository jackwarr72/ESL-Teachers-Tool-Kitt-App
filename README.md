<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1o2JZGDOZZQ9-l9706Yhlg8d1mNu37QTV

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

This repository includes a GitHub Actions workflow that builds the Vite app and deploys the `dist` folder to GitHub Pages whenever you push to `main`.

1. Make sure the repo's GitHub Pages setting is set to use the `gh-pages` branch (the workflow will publish there automatically).
2. Push changes to `main` and the workflow will run and publish your site.

After the workflow completes, your app will be available at:

`https://<your-github-username>.github.io/ESL-Teachers-Tool-Kitt-App/`

If you prefer Netlify or Vercel for automatic preview URLs and better CDNs, I can add deployment instructions for those too.
