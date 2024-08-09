import Logo from '../../common/Logo/index.js'
import {FaFacebookF} from '@react-icons/all-files/fa/FaFacebookF'
import {FaLinkedinIn} from '@react-icons/all-files/fa/FaLinkedinIn'
import {FaPhoneAlt} from '@react-icons/all-files/fa/FaPhoneAlt'
import {FaTwitter} from '@react-icons/all-files/fa/FaTwitter'
import {IoLocation} from '@react-icons/all-files/io5/IoLocation'
import {IoMail} from '@react-icons/all-files/io5/IoMail'
import {GrInstagram} from '@react-icons/all-files/gr/GrInstagram'

const FooterComponent = ({
	footerData,
	navLinks,
}: {
	footerData: {
		descriptions: string[]
		payments: string[]
		colum2Title: string
		colum3Title: string
		address: string
		tel: string
		email: string
		copyrights: string
		facebook?: string
		instagram?: string
		twitter?: string
		linkedin?: string
	}
	navLinks: {hash: string; title: string}[]
}) => {
	const {descriptions, payments, colum2Title, colum3Title, address, tel, email, copyrights, facebook, instagram, twitter, linkedin} = footerData

	return (
		<footer className="text-white-100 text-white-100/90 flex flex-col items-center justify-center bg-primary">
			<div className="custom-container-2 flex flex-wrap justify-center gap-2 lg:flex-nowrap lg:justify-between lg:gap-20">
				<div className="flex w-full flex-col gap-3 py-6 md:w-6/12 lg:w-4/12">
					<div className="flex justify-center lg:justify-start">
						<div className="w-[250px]">
							<Logo />
						</div>
					</div>
					{descriptions?.map((text: string, index: number) => {
						return (
							<p
								key={text + index}
								className="pb-3 text-center text-[16px] leading-7 lg:text-start">
								{text}
							</p>
						)
					})}

					<div className="flex flex-wrap justify-center gap-3 sm:flex-nowrap lg:justify-start">
						{payments?.map((image: string, index: number) => {
							return (
								<img
									key={'payments' + index}
									src={image}
									alt="Ödeme Yöntemleri"
									className="shadow-custom-2 rounded-md"
								/>
							)
						})}
					</div>
				</div>

				<div className="flex w-full flex-col items-center py-6 md:w-6/12 lg:w-3/12">
					<h5 className="border-b-grey-100/10 mb-3 w-full border-b pb-3 text-center text-[20px] font-bold tracking-wider lg:text-start">{colum2Title}</h5>
					<ul className="mb-3 flex w-full flex-wrap justify-center gap-5 text-[17px] sm:justify-between">
						{navLinks?.map(({hash, title}: {hash: string; title: string}, index: number) => {
							return (
								<li
									key={title + index}
									className="flex w-[46%] justify-center lg:block">
									<a
										href={hash}
										className="hover:text-white-100/60 transition-colors">
										{title}
									</a>
								</li>
							)
						})}
					</ul>
				</div>

				<div className="flex w-full flex-col items-center gap-3 py-6 md:w-6/12 lg:w-4/12 lg:items-start">
					<h5 className="border-b-grey-100/10 w-full border-b pb-3 text-center text-[20px] font-bold tracking-wider lg:text-start">{colum3Title}</h5>
					<div className="flex w-full items-center gap-3 md:w-8/12 lg:w-full">
						<div className="shadow-custom-2 bg-white-100/10 text-white-100 rounded-md p-2 text-[20px]">
							<IoLocation />
						</div>
						<div>
							<p className="text-white-100 text-[14px] font-medium tracking-wider">Adres</p>
							<address className="text-[15px] italic">{address}</address>
						</div>
					</div>

					<div className="flex w-full items-center gap-3 md:w-8/12 lg:w-full">
						<div className="shadow-custom-2 bg-white-100/10 text-white-100 rounded-md p-2 text-[20px]">
							<FaPhoneAlt />
						</div>
						<div>
							<p className="text-white-100 text-[14px] font-medium tracking-wider">Telefon</p>
							<a
								href={`tel:+9${tel}`}
								className="text-[15px] italic">
								{tel}
							</a>
						</div>
					</div>

					<div className="flex w-full items-center gap-3 pb-3 md:w-8/12 lg:w-full">
						<div className="shadow-custom-2 bg-white-100/10 text-white-100 rounded-md p-2 text-[20px]">
							<IoMail />
						</div>
						<div>
							<p className="text-white-100 text-[14px] font-medium tracking-wider">Mail</p>
							<a
								href="mailto:info@tiksoft.com.tr"
								className="text-[15px] italic">
								{email}
							</a>
						</div>
					</div>
				</div>
			</div>

			<div className="flex w-full justify-center bg-slate-100/10">
				<div className="custom-container-2">
					<div className="border-grey-100/10 flex w-full flex-wrap items-center justify-center gap-3 border-t py-3 sm:flex-nowrap sm:justify-between sm:gap-20">
						<p className="text-white-100/90 w-full text-center text-[15px] font-light tracking-wide sm:w-4/12 sm:text-start">{copyrights}</p>
						<div className="text-white-100 flex w-full justify-center gap-3 text-[16px] sm:w-4/12 sm:justify-end">
							{facebook && (
								<a
									href={facebook}
									target="_blank"
									className="shadow-custom-2 border-white-100/10 rounded-md border-[1px] p-2 transition-transform hover:scale-110">
									<FaFacebookF />
								</a>
							)}

							{instagram && (
								<a
									href={instagram}
									target="_blank"
									className="shadow-custom-2 border-white-100/10 rounded-md border-[1px] p-2 transition-transform hover:scale-110">
									<GrInstagram />
								</a>
							)}

							{twitter && (
								<a
									href={twitter}
									target="_blank"
									className="shadow-custom-2 border-white-100/10 rounded-md border-[1px] p-2 transition-transform hover:scale-110">
									<FaTwitter />
								</a>
							)}

							{linkedin && (
								<a
									href={linkedin}
									target="_blank"
									className="shadow-custom-2 border-white-100/10 rounded-md border-[1px] p-2 transition-transform hover:scale-110">
									<FaLinkedinIn />
								</a>
							)}
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default FooterComponent
