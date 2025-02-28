import {PageProps as BasePageProps} from '@/types'

interface Bank {
	id: number
	name: string
	type: string
	currency: string
}

export interface Transactions {
	data: Transaction[]
	path: string
	per_page: number
	current_page: number
	last_page: number
	next_page_url: null | string
	prev_page_url: null | string
}

export interface Transaction {
	id: number
	customer_id: number
	type: string
	date: string
	amount: number
	info: string
}

export interface Customer {
	id: number
	title: string
	type: string
	tax_number: string
	email: string
	phone: string
	country: string
	city: string
	address: string
	remaining_balance: number
	remaining_balance_formatted: string
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	currency: string
	customer: Customer
	banks: Bank[]
}
