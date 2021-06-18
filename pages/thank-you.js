/* eslint-disable  */
import React from 'react';
import { useQueryClient } from 'react-query';
import Link from 'next/link';

export default function ThankYou() {
	const queryClient = useQueryClient();
	const checkout = queryClient.getQueryData( 'checkout' );
	return (
		<div className="bg-white">
			<div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
				<div className="text-center">
					<h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">
						Order Received!
					</h2>
					<p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
						Your Order { checkout?.order_id } is{ ' ' }
						{ checkout?.status || 'received' }
					</p>
					<p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
						Thank you for placing an order, we will contact you on{ ' ' }
						{ checkout?.billing_address?.email } for updates.
					</p>
						<Link href="/">
							<a className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 md:py-4 md:text-lg md:px-10">
								Back to shopping
							</a>
						</Link>
				</div>
			</div>
		</div>
	);
}
