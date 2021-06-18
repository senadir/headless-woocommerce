import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { XIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { useCart } from '../../hooks';
import Item from './item';
import { formatPrice, getCurrencyFromPriceResponse } from '../../utils';

export function Cart( { open, setOpen } ) {
	const { items: cartItems, cartLoaded, totals, ...rest } = useCart();
	const router = useRouter();
	useEffect( () => {
		const handleRouteChange = () => {
			if ( open ) {
				setOpen( false );
			}
		};

		router.events.on( 'routeChangeComplete', handleRouteChange );

		// If the component is unmounted, unsubscribe
		// from the event with the `off` method:
		return () => {
			router.events.off( 'routeChangeComplete', handleRouteChange );
		};
	}, [ open ] );

	return (
		<Transition.Root show={ open } as={ Fragment }>
			<Dialog
				as="div"
				static
				className="fixed inset-0 overflow-hidden"
				open={ open }
				onClose={ setOpen }
			>
				<div className="absolute inset-0 overflow-hidden">
					<Dialog.Overlay className="absolute inset-0" />

					<div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
						<Transition.Child
							as={ Fragment }
							enter="transform transition ease-in-out duration-500 sm:duration-700"
							enterFrom="translate-x-full"
							enterTo="translate-x-0"
							leave="transform transition ease-in-out duration-500 sm:duration-700"
							leaveFrom="translate-x-0"
							leaveTo="translate-x-full"
						>
							<div className="w-screen max-w-md">
								<div className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl">
									<div className="min-h-0 flex-1 flex flex-col py-6 overflow-y-scroll">
										<div className="px-4 sm:px-6">
											<div className="flex items-start justify-between">
												<Dialog.Title className="text-lg font-medium text-gray-900">
													Shopping Cart
												</Dialog.Title>
												<div className="ml-3 h-7 flex items-center">
													<button
														className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
														onClick={ () =>
															setOpen( false )
														}
													>
														<span className="sr-only">
															Close cart
														</span>
														<XIcon
															className="h-6 w-6"
															aria-hidden="true"
														/>
													</button>
												</div>
											</div>
										</div>
										<div className="mt-6 relative flex-1 px-4 sm:px-6">
											<div className="overflow-hidden sm:rounded-md">
												<ul className="space-y-6">
													{ !! cartItems &&
														cartItems.map(
															( item ) => (
																<Item
																	key={
																		item.key
																	}
																	item={
																		item
																	}
																/>
															)
														) }
												</ul>
											</div>
										</div>
									</div>
									{ cartLoaded && (
										<div className="flex-shrink-0 px-4 py-4 flex flex-wrap justify-center">
											<div className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full mb-4">
												<span className="text-gray-900 text-xl">
													Subtotal
												</span>
												<span className="text-gray-900 text-xl">
													{ formatPrice(
														totals.totalPrice,
														getCurrencyFromPriceResponse(
															totals
														)
													) }
												</span>
											</div>
											<Link href="/checkout">
												<button
													type="submit"
													className="block w-full flex flex-grow-1 justify-center py-4 border border-transparent shadow-sm text-lg font-medium rounded-md text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
												>
													Go to Checkout →
												</button>
											</Link>
										</div>
									) }
								</div>
							</div>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
