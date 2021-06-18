import React from 'react';
import Link from 'next/link';
import { Item } from '../item';
import styles from './CartItem.module.css';
import { TrashIcon } from '@heroicons/react/outline';

export default function CartItem( { item } ) {
	return (
		<>
			<Item item={ item } className="px-4 py-4 sm:px-6">
				<div className="flex ">
					<Item.Image className="mr-4 flex-shrink-0 self-center h-16 w-16 border border-gray-300 " />
					<div>
						<Link href={ `/product/${ item.slug }` } passHref>
							<Item.Title
								as="a"
								className="text-sm font-medium underline truncate mb-2 block"
							/>
						</Link>
						<Item.Quantity className={ styles.quantity } />
					</div>
					<div className="ml-auto flex-shrink-0 flex flex-col items-end">
						<Item.Price
							override={ {
								prices: ( _, { totals } ) => ( {
									...totals,
									price: totals?.lineTotal,
								} ),
							} }
							className="inline-flex text-xs font-semibold mt-1 mb-4"
						/>
						<Item.Remove className="disabled:text-gray-200">
							<TrashIcon className="h-4 w-4" />
						</Item.Remove>
					</div>
				</div>
			</Item>

			<div></div>
		</>
	);
}
