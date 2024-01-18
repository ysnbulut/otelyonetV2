import React, {PropsWithChildren} from 'react'
function ItemName({
	deleted,
	warning_message,
	children,
}: PropsWithChildren<{deleted: boolean; warning_message: string}>) {
	return (
		<div className="flex items-baseline justify-start gap-2">
			{deleted ? (
				<div className="flex flex-1 flex-col items-start justify-center">
					<h3 className="text-left text-base font-semibold text-danger">Silmek İstediğine Emin Misin ?</h3>
					{warning_message !== null && (
						<span
							className="text-xs text-danger/60"
							dangerouslySetInnerHTML={{__html: warning_message}}
						/>
					)}
				</div>
			) : (
				children
			)}
		</div>
	)
}

export default ItemName
