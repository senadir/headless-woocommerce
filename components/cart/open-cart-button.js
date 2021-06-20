import React from 'react';
import { useCart } from '../../hooks';
import { ShoppingCartIcon } from '@heroicons/react/outline';

export default function OpenCartButton( { setOpen } ) {
	const { itemsCount } = useCart();
	return (
		<div className="hidden sm:ml-6 sm:flex sm:items-center">
			<button
				className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 relative"
				onClick={ () => setOpen( ( isOpen ) => ! isOpen ) }
			>
				<span className="sr-only">View Cart</span>
				{ !! itemsCount && (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 absolute -top-1">
						{ itemsCount }
					</span>
				) }
				<ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
			</button>
		</div>
	);
}
