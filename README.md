# Nova AI

Nova AI is a Vite/React PWA with a secure Netlify Function for Gemini.

## Netlify
- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`
- Required environment variable: `GEMINI_API_KEY` (keep it as a secret; never put it in client code)
- Optional: `GEMINI_MODEL` (defaults to `gemini-3.8-flash`)
