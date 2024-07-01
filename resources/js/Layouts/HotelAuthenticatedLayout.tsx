import {PropsWithChildren, ReactNode, useEffect, useState} from 'react'
import {hotelSelectSideMenu} from '@/stores/hotelSideMenuSlice'
import {useAppSelector} from '@/stores/hooks'
import {FormattedMenu, nestedMenu} from '@/types/side-menu'
import {usePage} from '@inertiajs/react'
import {PageProps} from '@/types'
import AuthLayout from '@/Layouts/AuthLayout'
interface BreadcrumbItem {
	title: string
	href: string
}
function Authenticated({
	header,
	breadcrumb,
	children,
}: PropsWithChildren<{
	header?: ReactNode
	breadcrumb: BreadcrumbItem[]
}>) {
	const {props} = usePage<PageProps>()
	const [formattedMenu, setFormattedMenu] = useState<Array<FormattedMenu | 'divider'>>([])
	const hotelSideMenuStore = useAppSelector(hotelSelectSideMenu)
	const sideMenu = () =>
		nestedMenu(hotelSideMenuStore, props.auth.role, props.auth.permissions, props.auth.pricing_policy)
	useEffect(() => {
		setFormattedMenu(sideMenu())
	}, [hotelSideMenuStore, route().current()])

	return (
		<AuthLayout
			auth={props.auth}
			setFormattedMenu={setFormattedMenu}
			formattedMenu={formattedMenu}
			breadcrumb={breadcrumb}
			children={children}
		/>
	)
}
export default Authenticated
