import { useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import 'tailwindcss/tailwind.css';
import { Cart } from '../components';
import OpenCartButton from '../components/cart/open-cart-button';

const navigation = [
	{ name: 'Dashboard', href: '#', current: true },
	{ name: 'Team', href: '#', current: false },
	{ name: 'Projects', href: '#', current: false },
	{ name: 'Calendar', href: '#', current: false },
];

function classNames( ...classes ) {
	return classes.filter( Boolean ).join( ' ' );
}

function MyApp( { Component, pageProps } ) {
	const [ queryClient ] = useState( () => new QueryClient() );
	const [ cartIsOpen, setCartIsOpen ] = useState( false );
	return (
		<QueryClientProvider client={ queryClient }>
			<Hydrate state={ pageProps.dehydratedState }>
				<div className="min-h-screen bg-white">
					<Disclosure
						as="nav"
						className="bg-white border-b border-gray-200"
					>
						{ ( { open } ) => (
							<>
								<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
									<div className="flex justify-between h-16">
										<div className="flex">
											<div className="flex-shrink-0 flex items-center">
												<img
													className="block lg:hidden h-8 w-auto"
													src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
													alt="Workflow"
												/>
												<img
													className="hidden lg:block h-8 w-auto"
													src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
													alt="Workflow"
												/>
											</div>
											<div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
												{ navigation.map( ( item ) => (
													<a
														key={ item.name }
														href={ item.href }
														className={ classNames(
															item.current
																? 'border-indigo-500 text-gray-900'
																: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
															'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
														) }
														aria-current={
															item.current
																? 'page'
																: undefined
														}
													>
														{ item.name }
													</a>
												) ) }
											</div>
										</div>
										<OpenCartButton
											setOpen={ setCartIsOpen }
										/>
									</div>
								</div>
							</>
						) }
					</Disclosure>

					<div className="py-10">
						<main>
							<div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
								<Cart
									open={ cartIsOpen }
									setOpen={ setCartIsOpen }
								/>
								<Component { ...pageProps } />
							</div>
						</main>
					</div>
				</div>
			</Hydrate>
		</QueryClientProvider>
	);
}
export default MyApp;
