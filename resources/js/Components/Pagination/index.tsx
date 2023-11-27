import { twMerge } from 'tailwind-merge'
import { Link, InertiaLinkProps } from '@inertiajs/react'
import Button from '@/Components/Button'

type PaginationProps = React.PropsWithChildren & React.ComponentPropsWithoutRef<'nav'>;

function Pagination({ className, children }: PaginationProps) {
    return (<nav className={className}>
        <ul className='flex w-full mr-0 sm:w-auto sm:mr-auto'>{children}</ul>
    </nav>)
}

Pagination.Link = ({ active = false, as = 'a', className = '', children, ...props }: InertiaLinkProps & {
    active?: boolean,
    as?: string
}) => {
    return (<li className='flex-1 sm:flex-initial'>
        {props.href !== '#' ? (<Link
            {...props}
            as={as}
            className={twMerge(['min-w-0 sm:min-w-[40px] shadow-none font-normal flex items-center justify-center border-transparent text-slate-800 sm:mr-2 dark:text-slate-300 px-1 sm:px-3 py-2', active && '!box font-medium dark:bg-darkmode-400', className])}
        >
            {children}
        </Link>) : (<Button
            className={twMerge(['min-w-0 sm:min-w-[40px] shadow-none font-normal flex items-center ring-0 border-0 focus:ring-0 justify-center border-transparent text-slate-800 sm:mr-2 dark:text-slate-300 px-1 sm:px-3 py-2', active && '!box font-medium dark:bg-darkmode-400', className])}
        >
            {children}
        </Button>)}

    </li>)
}

export default Pagination
