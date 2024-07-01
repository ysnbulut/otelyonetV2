import './bootstrap'
import 'react-clock/dist/Clock.css'
import '../css/app.css'
import {createRoot} from 'react-dom/client'
import {createInertiaApp} from '@inertiajs/react'
import {resolvePageComponent} from 'laravel-vite-plugin/inertia-helpers'
import {Provider} from 'react-redux'
import {store} from '@/stores/store'
import 'sweetalert2/dist/sweetalert2.css'
import * as PusherPushNotifications from '@pusher/push-notifications-web'

// const beamsClient = new PusherPushNotifications.Client({
// 	instanceId: '68c490a6-6342-4c5c-9bf3-f13d2f7ad8ed',
// })
//
// beamsClient
// 	.start()
// 	.then(() => beamsClient.addDeviceInterest('hello'))
// 	.then(() => console.log('Successfully registered and subscribed!'))
// 	.catch(console.error)

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
		color: '#FF0075',
		includeCSS: true,
		showSpinner: false,
	},
})
