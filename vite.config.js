import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/* Duong dan goc khi deploy / Base path when deploying.
   - GitHub Pages tai <user>.github.io/<ten-repo>/  ->  "/<ten-repo>/"
   - GitHub Pages tai repo <user>.github.io         ->  "/"
   - Vercel, Netlify, hoac chay o may               ->  "/"
   Doi cho khop ten repository cua ban.
   Change this to match your repository name. */
const base = "/phishguard-school/";

export default defineConfig({
  base,
  plugins: [react()],
});
