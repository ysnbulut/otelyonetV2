import './bootstrap'
import '../css/app.css'
import {createRoot} from 'react-dom/client'
import {createInertiaApp} from '@inertiajs/react'
import {resolvePageComponent} from 'laravel-vite-plugin/inertia-helpers'
import {Provider} from 'react-redux'
import {store} from '@/stores/store'
import 'sweetalert2/dist/sweetalert2.css'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'

createInertiaApp({
	title: (title) => `${title} - ${appName}`,
	resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
	setup({el, App, props}) {
		const root = createRoot(el)
		root.render(
			<Provider store={store}>
				<App {...props} />
			</Provider>,
		)
	},
	progress: {
		color: '#0800ff',
	},
})
