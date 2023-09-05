import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { cssModules } from 'svelte-preprocess-cssmodules';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    resolve: {
      alias: {
        '~': resolve(__dirname, 'src')
      }
    },
    plugins: [
      svelte({
        preprocess: [
          // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
          // for more information about preprocessors
          vitePreprocess(),
          cssModules({
            localIdentName: mode === 'development' ? '[name]__[local]' : '[hash:base64:5]',
            useAsDefaultScoping: true
          })
        ],
        configFile: false
      })
    ],
    server: {
      host: '0.0.0.0'
    }
  };
});
