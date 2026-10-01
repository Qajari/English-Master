# English Master

A mobile-first English learning PWA built with React + Vite.

## Requirements
- Windows 10/11
- Node.js 18+ (Node 20+ recommended)
- VS Code optional

## Run
Open CMD in this folder:

```bash
npm install
npm run dev
```

Then open the address Vite shows, usually:
http://localhost:5173/

## iPhone
The development server must be reachable from the iPhone on the same Wi-Fi network. Vite is configured with `host: true`.
Use the PC's local IP, for example:
http://192.168.1.131:5173/

For a real public install, build with:
npm run build

Then deploy the `dist` folder to any static HTTPS host.

## Important
This version intentionally uses no external AI API. Progress is stored in the browser's localStorage.
Listening uses the browser's speech synthesis as an offline-friendly starter.
Speaking uses browser Speech Recognition when supported.
