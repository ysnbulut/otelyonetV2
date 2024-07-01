export interface User {
	id: number
	name: string
	email: string
	email_verified_at: string
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
	auth: {
		user: User
		role: string
		permissions: string[]
		pricing_policy: string
	}
	prefix: string
	csrf_token: string
	flash: {
		success: string
		errors: string[]
		message: string
		info: string
		warning: string
		status: string
		old: string[]
	}
}
