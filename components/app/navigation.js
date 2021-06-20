import React from 'react';
import { Disclosure } from '@headlessui/react';
import Link from 'next/link';
import OpenCartButton from '../cart/open-cart-button';
import classnames from 'classnames';
import { useRouter } from 'next/router';
import { useApp } from './context';

const navigation = [
	{ name: 'All Products', href: '/' },
	{ name: 'Accessories', href: '/category/accessories/19' },
	{ name: 'Music', href: '/category/music/20' },
	{ name: 'Checkout', href: '/checkout' },
];
export const Navigation = () => {
	const { asPath } = useRouter();

	return (
		<Disclosure as="nav" className="bg-white border-b border-gray-200">
			{ () => (
				<>
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex justify-between h-16">
							<div className="flex">
								<div className="flex-shrink-0 flex items-center">
									<img
										className="block lg:hidden h-8 w-auto"
										src="https://woocommerce.com/wp-content/themes/woo/images/logo-woocommerce.svg"
										alt="WooCommerce"
									/>
									<img
										className="hidden lg:block h-8 w-auto"
										src="https://woocommerce.com/wp-content/themes/woo/images/logo-woocommerce.svg"
										alt="WooCommerce"
									/>
								</div>
								<div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
									{ navigation.map( ( item ) => (
										<Link
											key={ item.name }
											href={ item.href }
										>
											<a
												className={ classnames(
													'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
													{
														'border-purple-500 text-gray-900':
															item.href ===
															asPath,
													}
												) }
												aria-current={
													item.href === asPath
														? 'page'
														: undefined
												}
											>
												{ item.name }
											</a>
										</Link>
									) ) }
								</div>
							</div>
							<OpenCartButton />
						</div>
					</div>
				</>
			) }
		</Disclosure>
	);
};
