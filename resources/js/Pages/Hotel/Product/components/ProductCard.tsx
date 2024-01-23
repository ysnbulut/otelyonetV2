import React from 'react'
import Lucide from '@/Components/Lucide'
import {ProductCardDataProps} from '@/Pages/Hotel/Product/types/product-card'

function ProductCard(props: ProductCardDataProps) {
	return (
		<div className="intro-y col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
			<div className="box">
				<div className="p-5">
					<div className="image-fit h-40 overflow-hidden rounded-md before:absolute before:left-0 before:top-0 before:z-10 before:block before:h-full before:w-full before:bg-gradient-to-t before:from-black before:to-black/10 2xl:h-56">
						<img
							alt="Midone - HTML Admin Template"
							className="rounded-md"
							src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
						/>
						<span className="absolute top-0 z-10 m-5 rounded bg-pending/80 px-2 py-1 text-xs text-white">Featured</span>
						<div className="absolute bottom-0 z-10 px-5 pb-6 text-white">
							<a
								href=""
								className="block text-base font-medium">
								{props.product.name}
							</a>
							<span className="mt-3 text-xs text-white/90">{props.product.category}</span>
						</div>
					</div>
					<div className="mt-5 text-slate-600 dark:text-slate-500">
						<div className="flex items-center">
							<Lucide
								icon="Link"
								className="mr-2 h-4 w-4"
							/>
							Price: {props.product.price}
						</div>
						{/*<fieldset className="mt-2 p-1 text-xs">*/}
						{/*	<legend className="-ml-2 px-1 py-0.5 font-semibold">Birimler</legend>*/}
						{/*	<p className="overflow-hidden text-clip">*/}
						{/*		{props.product.units.map((unit: any) => unit.name).join(', ')}*/}
						{/*	</p>*/}
						{/*</fieldset>*/}
						<div className="mt-2 flex items-center">
							<Lucide
								icon="CheckSquare"
								className="mr-2 h-4 w-4"
							/>
							Status: AKTİF /PASİF
						</div>
					</div>
				</div>
				<div className="flex items-center justify-center border-t border-slate-200/60 p-5 lg:justify-end dark:border-darkmode-400">
					<a
						className="mr-auto flex items-center text-primary"
						href="#">
						<Lucide
							icon="Eye"
							className="mr-1 h-4 w-4"
						/>
						Preview
					</a>
					<a
						className="mr-3 flex items-center"
						href="#">
						<Lucide
							icon="CheckSquare"
							className="mr-1 h-4 w-4"
						/>
						Edit
					</a>
					<a
						className="flex items-center text-danger"
						href="#"
						onClick={(e) => {
							e.preventDefault()
						}}>
						<Lucide
							icon="Trash2"
							className="mr-1 h-4 w-4"
						/>
						Delete
					</a>
				</div>
			</div>
		</div>
	)
}

export default ProductCard
