const Button = ({children, style, url = '/', handleClick = () => {}}: {children: React.ReactNode; style: string; url?: string; handleClick?: () => void}) => {
	return (
		<a
			onClick={handleClick}
			href={url}
			target={url?.startsWith('#') ? '_self' : '_blank'}
			className={`btn ${style}`}>
			<i className="animation"></i>
			{children}
			<i className="animation"></i>
		</a>
	)
}

export default Button
