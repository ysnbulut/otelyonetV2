import {useState, useEffect, useRef} from 'react'
import Logo from '../../common/Logo/index.js'
import Button from '@/Components/Button'
import {FaBars} from '@react-icons/all-files/fa/FaBars'
import {IoCloseSharp} from '@react-icons/all-files/io5/IoCloseSharp'
import useDetectOutsideClick from '../../../utils/useDetectOutsideClick.jsx'
import {twMerge} from 'tailwind-merge'

const Header = ({
	navLinks,
	mobileMenuTitle,
	headerButton1,
	headerButton2,
	isOpen,
	setIsOpen,
}: {
	navLinks: {hash: string; title: string}[]
	mobileMenuTitle: string
	headerButton1: {url: string; title: string}
	headerButton2: {url: string; title: string}
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
}) => {
	const [isSticky, setIsSticky] = useState(false)
	const [activeSection, setActiveSection] = useState('')

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > 1280) {
				setIsOpen(false)
			}
		}

		handleResize()

		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	const handleScroll = () => {
		const offset = window.scrollY
		setIsSticky(offset > 0)

		let currentSection = ''
		navLinks?.forEach(({hash}) => {
			const sectionElement = document.querySelector(hash)
			if (sectionElement) {
				// @ts-ignore
				const sectionTop = sectionElement.offsetTop - 140
				// @ts-ignore
				const sectionBottom = sectionTop + sectionElement.offsetHeight
				if (offset >= sectionTop && offset <= sectionBottom) {
					currentSection = hash
				}
			}
		})
		setActiveSection(currentSection)
	}

	useEffect(() => {
		window.addEventListener('scroll', handleScroll)
		handleScroll()

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	const menuRef = useRef(null)
	const buttonRef = useRef(null)

	useDetectOutsideClick(menuRef, buttonRef, isOpen, setIsOpen)

	return (
		<header
			className={twMerge(
				'left-0 top-0 z-[999] flex w-full flex-col items-center justify-center transition-colors duration-500 ease-linear',
				isOpen ? 'fixed' : 'block lg:fixed',
				isSticky && !isOpen ? 'bg-black/20' : '',
			)}>
			<div className={twMerge('container flex justify-between', isSticky && !isOpen ? 'py-[15px]' : 'py-[15px]')}>
				<div className="h-[70px] w-fit">
					<Logo />
				</div>
				<nav className="hidden items-center lg:flex">
					<ul className="flex items-center justify-center gap-7 text-[18px] font-light text-white">
						{navLinks?.map(({hash, title}: {hash: string; title: string}) => (
							<li
								key={hash}
								className={twMerge('nav-link', activeSection === hash ? 'active-nav-link' : '')}>
								<a href={hash}>{title}</a>
							</li>
						))}
					</ul>
				</nav>

				<div className="hidden items-center gap-5 lg:flex">
					<Button
						as="a"
						variant="pending"
						className="px-5 py-2 text-lg"
						href={headerButton1?.url}>
						{headerButton1?.title}
					</Button>
				</div>

				<div className="flex items-center gap-5 lg:hidden">
					<Button
						onClick={() => {
							setIsOpen(true)
						}}>
						<FaBars />
					</Button>
				</div>
			</div>

			<div
				ref={menuRef}
				className={`shadow-custom-4 bg-white-100 fixed right-0 top-0 z-[99999999] h-full max-w-[550px] lg:!hidden ${isOpen ? '!block' : 'hidden'}`}>
				<div
					ref={buttonRef}
					className="flex h-[100px] w-full items-center justify-between bg-purple-100 p-5">
					<p className="text-white-100 number-style text-[30px] font-bold tracking-wider opacity-80">{mobileMenuTitle}</p>
					<Button
						onClick={() => {
							setIsOpen(false)
						}}>
						<IoCloseSharp />
					</Button>
				</div>

				<ul className="relative flex flex-wrap items-center justify-center gap-6 overflow-hidden px-6 py-6 text-[24px] font-normal tracking-wider text-primary">
					{navLinks?.map(({hash, title}: {hash: string; title: string}) => (
						<li
							key={hash}
							className={twMerge('nav-link w-full', activeSection === hash ? 'active-nav-link' : '')}>
							<a
								onClick={() => setIsOpen(false)}
								className="!block !w-full"
								href={hash}>
								{title}
							</a>
						</li>
					))}
				</ul>

				<div
					onClick={() => setIsOpen(false)}
					className="mt-5 flex flex-wrap items-center gap-5 border-y border-purple-100/10 p-5 sm:flex-nowrap">
					<Button
						as="a"
						variant="pending"
						href={headerButton1?.url}>
						{headerButton1?.title}
					</Button>
				</div>
			</div>
			<div className="bg-white-200 h-[1px] w-full opacity-10"></div>
		</header>
	)
}

export default Header
