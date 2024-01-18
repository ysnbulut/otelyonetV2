import {twMerge} from 'tailwind-merge'
import {Link, InertiaLinkProps} from '@inertiajs/react'
import Button from '@/Components/Button'

type PaginationProps = React.PropsWithChildren & React.ComponentPropsWithoutRef<'nav'>

function Pagination({className, children}: PaginationProps) {
	return (
		<nav className={className}>
			<ul className="mr-0 flex w-full sm:mr-auto sm:w-auto">{children}</ul>
		</nav>
	)
}

Pagination.Link = ({
	active = false,
	as = 'a',
	className = '',
	children,
	...props
}: InertiaLinkProps & {
	active?: boolean
	as?: string
}) => {
	return (
		<li className="flex flex-1 items-center justify-center text-center sm:flex-initial">
			{props.href !== '#' ? (
				<Link
					{...props}
					as={as}
					className={twMerge([
						'flex min-w-8 items-center justify-center border-transparent px-1 py-1 font-normal text-slate-800' +
							' shadow-none sm:mr-2 sm:min-w-[40px] sm:px-3 dark:text-slate-300',
						active && '!box font-medium dark:bg-darkmode-400',
						className,
					])}>
					{children}
				</Link>
			) : (
				<Button
					className={twMerge([
						'flex min-w-8 items-center border-0 font-normal shadow-none ring-0 sm:min-w-[40px]' +
							' justify-center border-transparent px-1 py-1 text-slate-800 focus:ring-0 sm:mr-2 sm:px-3' +
							' dark:text-slate-300',
						active && '!box font-medium dark:bg-darkmode-400',
						className,
					])}>
					{children}
				</Button>
			)}
		</li>
	)
}

export default Pagination
