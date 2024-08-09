import {logoImg} from '../../../constant.js'

const Logo = () => {
	return (
		<a href="/">
			<img
				src={logoImg}
				alt="Logo"
				className="h-full w-full"
			/>
		</a>
	)
}

export default Logo
