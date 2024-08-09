const Input = ({label, name, type, placeholder}: {label: string; name: string; type: string; placeholder: string}) => {
	return (
		<div className="flex flex-col gap-1">
			<label
				htmlFor={name}
				className="pl-1 text-[18px] font-semibold text-purple-100">
				{label}
			</label>
			<input
				name={name}
				id={name}
				type={type}
				placeholder={placeholder}
				className="shadow-custom-2 rounded-md px-6 py-4 outline-none"
			/>
		</div>
	)
}

export default Input
