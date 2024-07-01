import {defineConfig} from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'
import path from 'path'
const host = 'otelyonet.com'

export default defineConfig({
	// server: {
	// 	host,
	// 	hmr: {host},
	// 	https: {
	// 		key: fs.readFileSync(`/path/to/${host}.key`),
	// 		cert: fs.readFileSync(`/path/to/${host}.crt`),
	// 	},
	// },
	plugins: [
		laravel({
			input: 'resources/js/app.tsx',
			refresh: true,
		}),
		react(),
	],
	optimizeDeps: {
		include: ['tailwind-config'],
	},
	resolve: {
		alias: {
			'tailwind-config': path.resolve(__dirname, './tailwind.config.js'),
		},
	},
})
