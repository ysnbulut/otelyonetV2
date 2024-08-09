import {PageProps} from '@/types'
import About from './components/container/About'
import Features from './components/container/Features'
import Header from './components/container/Header'
import Intro from './components/container/Intro'
import Plans from './components/container/Plans'
import Footer from './components/container/Footer'
import Services from './components/container/Services'
import Referances from './components/container/Referances'
import Contact from './components/container/Contact'
import {useState} from 'react'

import {
	navLinks,
	headerButton1,
	headerButton2,
	introSlogan,
	introButton,
	introImg,
	aboutImg,
	aboutContent,
	aboutStats,
	featuresContent,
	featuresCards,
	planContent,
	planImg,
	planData,
	servicesContent,
	servicesData,
	servicesImg,
	servicesButton,
	referancesContent,
	referancesImg,
	referancesSlider,
	contactContent,
	contactFormImg,
	contactFormData,
	footerData,
	mobileMenuTitle,
} from './constant'
import React from 'react'

export default function Index({auth, phpVersion}: PageProps<{laravelVersion: string; phpVersion: string}>) {
	const cleanHash = (hash: string) => hash?.replace(/^#/, '')
	const id = navLinks.map(({hash}) => cleanHash(hash))
	const [isOpen, setIsOpen] = useState(false)

	return (
		<div className="-mx-8 -my-3">
			<Header
				navLinks={navLinks}
				mobileMenuTitle={mobileMenuTitle}
				headerButton1={headerButton1}
				headerButton2={headerButton2}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
			/>
			<Intro
				introSlogan={introSlogan}
				introButton={introButton}
				introImg={introImg}
				isOpen={isOpen}
			/>
			<About
				aboutImg={aboutImg}
				aboutContent={aboutContent}
				aboutStats={aboutStats}
				hash={id?.[0]}
			/>
			<Features
				featuresContent={featuresContent}
				featuresCards={featuresCards}
				hash={id?.[1]}
			/>
			<Plans
				planContent={planContent}
				planImg={planImg}
				planData={planData}
				hash={id?.[2]}
			/>
			<Services
				servicesContent={servicesContent}
				servicesData={servicesData}
				servicesImg={servicesImg}
				servicesButton={servicesButton}
				hash={id?.[3]}
			/>
			<Referances
				referancesContent={referancesContent}
				referancesImg={referancesImg}
				referancesSlider={referancesSlider}
				hash={id?.[4]}
			/>
			<Contact
				contactContent={contactContent}
				contactFormImg={contactFormImg}
				contactFormData={contactFormData}
				hash={id?.[5]}
			/>
			<Footer
				footerData={footerData}
				navLinks={navLinks}
			/>
		</div>
	)
}
