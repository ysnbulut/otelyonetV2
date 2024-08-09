import SectionTitle from '../../common/SectionTitle/index.js'
import Button from '../../common/Button/index.js'
import Input from '../../common/Input/index.js'

const Contact = ({
	contactContent,
	contactFormImg,
	contactFormData,
	hash,
}: {
	contactContent: {subtitle: string; title: string}
	contactFormImg: string
	contactFormData: {
		title: string
		subtitle: string
		inputs: {label: string; placeholder: string; name: string; type: string}[]
		textArea: {label: string; name: string; placeholder: string}
		button: {title: string}
	}
	hash: string
}) => {
	const {title, subtitle, inputs, textArea, button} = contactFormData

	return (
		<div
			id={hash}
			className="flex w-full justify-center bg-white">
			<div className="custom-container-1 py-[100px]">
				<div>
					<div className="mb-10 w-full text-center lg:mb-0 lg:hidden">
						<SectionTitle
							top={contactContent?.subtitle}
							bottom={contactContent?.title}
						/>
					</div>
					<div className="flex w-full items-start justify-center lg:justify-between xl:items-end">
						<div className="hidden w-5/12 flex-col lg:flex">
							<div className="mb-10 flex w-full flex-col items-center">
								<SectionTitle
									top={contactContent?.subtitle}
									bottom={contactContent?.title}
								/>
							</div>
							<img
								src={contactFormImg}
								alt={contactContent?.subtitle}
							/>
						</div>
						<div className="shadow-custom-5 bg-white-100 w-full rounded-2xl p-5 sm:p-10 lg:w-6/12">
							<div className="border-b-grey-300/10 flex w-full flex-col items-center gap-3 border-b pb-10">
								<h5 className="text-[24px] font-semibold tracking-wider text-purple-100">{title}</h5>
								<p className="text-soft">{subtitle}</p>
							</div>

							<form className="mt-[30px] flex flex-wrap justify-between gap-5">
								{inputs?.map(({label, placeholder, name, type}: {label: string; placeholder: string; name: string; type: string}, index: number) => {
									return (
										<div
											className="w-full sm:w-[46%]"
											key={label + index}>
											<Input
												label={label}
												name={name}
												type={type}
												placeholder={placeholder}
											/>
										</div>
									)
								})}

								<div className="flex w-full flex-col gap-2">
									<label
										htmlFor={textArea?.name}
										className="pl-1 text-[18px] font-semibold text-purple-100">
										{textArea?.label}
									</label>
									<textarea
										name={textArea?.name}
										id={textArea?.name}
										rows={5}
										placeholder={textArea?.placeholder}
										className="shadow-custom-2 w-full resize-none rounded-md px-6 py-4 outline-none"></textarea>
								</div>

								<Button style="bg-[#312e81] !w-full py-[15px] px-[20px] ">{button?.title}</Button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Contact
