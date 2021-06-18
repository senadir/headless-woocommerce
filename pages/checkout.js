import { QueryClient, useQuery } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { axios } from '../utils';
import {
	CreditCardIcon,
	KeyIcon,
	UserCircleIcon,
	UserGroupIcon,
	ViewGridAddIcon,
	CheckIcon,
} from '@heroicons/react/outline';
import ShippingMethods from '../components/checkout/shipping-methods';
import Stripe from '../components/checkout/stripe';
import { camelCase } from 'lodash';
import useCheckout from '../hooks/use-checkout';
import * as Yup from 'yup';

const navigation = [
	{ name: 'Account', href: '#', icon: UserCircleIcon, current: true },
	{ name: 'Password', href: '#', icon: KeyIcon, current: false },
	{ name: 'Plan & Billing', href: '#', icon: CreditCardIcon, current: false },
	{ name: 'Team', href: '#', icon: UserGroupIcon, current: false },
	{ name: 'Integrations', href: '#', icon: ViewGridAddIcon, current: false },
];

const steps = [
	{ id: '1.', name: 'Contact', href: '#', status: 'complete' },
	{ id: '2.', name: 'Address', href: '#', status: 'current' },
	{ id: '3.', name: 'Shipping', href: '#', status: 'upcoming' },
	{ id: '4.', name: 'Payment', href: '#', status: 'upcoming' },
];

const checkoutSchema = Yup.object().shape( {
	shipping_address: Yup.object( {
		first_name: Yup.string().required( 'Required' ),
		last_name: Yup.string().required( 'Required' ),
		address_1: Yup.string().required( 'Required' ),
		postcode: Yup.string().required( 'Required' ),
		country: Yup.string().required( 'Required' ),
		city: Yup.string().required( 'Required' ),
	} ),
	billing_address: Yup.object( {
		email: Yup.string().email( 'Invalid email' ).required( 'Required' ),
	} ),
} );
function classNames( ...classes ) {
	return classes.filter( Boolean ).join( ' ' );
}
export default function Checkout() {
	const { placeOrder, billing_address, shipping_address } = useCheckout();
	return (
		<div className="lg:grid lg:grid-cols-12">
			<aside className="py-6 px-4 sm:px-6 lg:py-0 lg:px-0 lg:col-span-6">
				<nav className="space-y-1">
					{ navigation.map( ( item ) => (
						<a
							key={ item.name }
							href={ item.href }
							className={ classNames(
								item.current
									? 'bg-gray-50 text-indigo-700 hover:text-indigo-700 hover:bg-white'
									: 'text-gray-900 hover:text-gray-900 hover:bg-gray-50',
								'group rounded-md px-3 py-2 flex items-center text-sm font-medium'
							) }
							aria-current={ item.current ? 'page' : undefined }
						>
							<item.icon
								className={ classNames(
									item.current
										? 'text-indigo-500 group-hover:text-indigo-500'
										: 'text-gray-400 group-hover:text-gray-500',
									'flex-shrink-0 -ml-1 mr-3 h-6 w-6'
								) }
								aria-hidden="true"
							/>
							<span className="truncate">{ item.name }</span>
						</a>
					) ) }
				</nav>
			</aside>
			<Formik
				validationSchema={ checkoutSchema }
				initialValues={ {
					billing_address,
					shipping_address,
					should_create_account: false,
				} }
				onSubmit={ ( values, formik ) => {
					placeOrder( { values, formik } );
				} }
			>
				{ ( { isSubmitting } ) => (
					<Form
						action="#"
						method="POST"
						className="space-y-6 sm:px-4 px-2 lg:col-span-6"
					>
						<div className="sm:overflow-hidden px-2">
							<nav aria-label="Progress">
								<ol className="space-y-4 md:flex md:space-y-0 md:space-x-8">
									{ steps.map( ( step ) => (
										<li
											key={ step.name }
											className="md:flex-1"
										>
											{ step.status === 'complete' ? (
												<a
													href={ step.href }
													className="group pl-4 py-2 flex flex-col border-l-4 border-indigo-600 hover:border-indigo-800 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4"
												>
													<span className="text-xs text-indigo-600 font-semibold tracking-wide uppercase group-hover:text-indigo-800">
														{ step.id }
													</span>
													<span className="text-sm font-medium">
														{ step.name }
													</span>
												</a>
											) : step.status === 'current' ? (
												<a
													href={ step.href }
													className="pl-4 py-2 flex flex-col border-l-4 border-indigo-600 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4"
													aria-current="step"
												>
													<span className="text-xs text-indigo-600 font-semibold tracking-wide uppercase">
														{ step.id }
													</span>
													<span className="text-sm font-medium">
														{ step.name }
													</span>
												</a>
											) : (
												<a
													href={ step.href }
													className="group pl-4 py-2 flex flex-col border-l-4 border-gray-200 hover:border-gray-300 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4"
												>
													<span className="text-xs text-gray-500 font-semibold tracking-wide uppercase group-hover:text-gray-700">
														{ step.id }
													</span>
													<span className="text-sm font-medium">
														{ step.name }
													</span>
												</a>
											) }
										</li>
									) ) }
								</ol>
							</nav>
							{ /* Start Step*/ }
							<div className="py-4 space-y-2 sm:py-6">
								<div>
									<h3 className="text-lg leading-6 font-medium text-gray-900">
										Contact Information
									</h3>
									<p className="mt-1 text-sm text-gray-500">
										We use your email to keep you updated
										about your order status.
									</p>
								</div>

								<div className="grid grid-cols-6 gap-4">
									<div className="col-span-12">
										<label
											htmlFor="billing_address.email"
											className="block text-sm font-medium text-gray-700"
										>
											Email
										</label>
										<Field
											type="email"
											name="billing_address.email"
											id="billing_address.email"
											autoComplete="email"
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										/>
										<ErrorMessage
											name="billing_address.email"
											component="p"
										/>
									</div>
									<div className="flex items-start col-span-12">
										<div className="h-5 flex items-center">
											<Field
												id="create_customer_account"
												name="create_customer_account"
												type="checkbox"
												className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
											/>
										</div>
										<div className="ml-3 text-sm">
											<label
												htmlFor="create_customer_account"
												className="font-medium text-gray-700"
											>
												Create an account?
											</label>
										</div>
									</div>
								</div>
							</div>
							{ /* End step */ }
							{ /* Start Step*/ }
							<div className="py-4 space-y-2 sm:py-6">
								<div>
									<h3 className="text-lg leading-6 font-medium text-gray-900">
										Shipping Address
									</h3>
									<p className="mt-1 text-sm text-gray-500">
										We use your email to keep you updated
										about your order status.
									</p>
								</div>

								<div className="grid grid-cols-6 gap-4">
									<div className="col-span-6 sm:col-span-3">
										<label
											htmlFor="shipping_address.first_name"
											className="block text-sm font-medium text-gray-700"
										>
											First name
										</label>
										<Field
											type="text"
											name="shipping_address.first_name"
											id="shipping_address.first_name"
											autoComplete="given-name"
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										/>
									</div>
									<div className="col-span-6 sm:col-span-3">
										<label
											htmlFor="shipping_address.last_name"
											className="block text-sm font-medium text-gray-700"
										>
											Last name
										</label>
										<Field
											type="text"
											name="shipping_address.last_name"
											id="shipping_address.last_name"
											autoComplete="family-name"
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										/>
									</div>

									<div className="col-span-6 sm:col-span-3">
										<label
											htmlFor="shipping_address.address_1"
											className="block text-sm font-medium text-gray-700"
										>
											Address
										</label>
										<Field
											autoComplete="address-line1"
											autoCorrect="off"
											role="combobox"
											aria-autocomplete="list"
											aria-expanded="false"
											aria-required="true"
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
											type="text"
											name="shipping_address.address_1"
											id="shipping_address.address_1"
										/>
									</div>
									<div className="col-span-6 sm:col-span-3">
										<label
											htmlFor="shipping_address.postcode"
											className="block text-sm font-medium text-gray-700"
										>
											Postal / ZIP
										</label>
										<Field
											autoComplete="postal-code"
											autoCorrect="off"
											role="combobox"
											aria-autocomplete="list"
											aria-expanded="false"
											aria-required="true"
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
											type="text"
											name="shipping_address.postcode"
											id="shipping_address.postcode"
										/>
									</div>
									<div className="col-span-6 sm:col-span-3">
										<label
											htmlFor="shipping_address.country"
											className="block text-sm font-medium text-gray-700"
										>
											Country / Region
										</label>
										<Field
											id="shipping_address.country"
											as="select"
											name="shipping_address.country"
											autoComplete="country-name"
											className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										>
											<option value="US">
												United States
											</option>
											<option value="CA">Canada</option>
											<option value="MX">Mexico</option>
											<option value="DZ">Algeria</option>
										</Field>
									</div>

									<div className="col-span-6 sm:col-span-3">
										<label
											htmlFor="shipping_address.city"
											className="block text-sm font-medium text-gray-700"
										>
											City
										</label>
										<Field
											autoComplete="address-level2"
											autoCorrect="off"
											role="combobox"
											aria-autocomplete="list"
											aria-expanded="false"
											aria-required="true"
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
											type="text"
											name="shipping_address.city"
											id="shipping_address.city"
										/>
									</div>
								</div>
							</div>
							{ /* End step */ }
							{ /* Start Step*/ }
							<div className="py-4 space-y-2 sm:py-6">
								<div>
									<h3 className="text-lg leading-6 font-medium text-gray-900">
										Shipping Method
									</h3>
								</div>

								<ShippingMethods />
							</div>
							{ /* End step */ }
							{ /* Start Step*/ }
							<div className="py-4 space-y-2 sm:py-6">
								<div>
									<h3 className="text-lg leading-6 font-medium text-gray-900">
										Payment method
									</h3>
								</div>

								<Stripe />
							</div>
							{ /* End step */ }

							<div className="px-4 py-3 text-right sm:px-6">
								<button
									type="submit"
									className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								>
									Place Order
								</button>
							</div>
						</div>
					</Form>
				) }
			</Formik>
		</div>
	);
}

export async function getServerSideProps( { req } ) {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery( 'cart', () =>
		axios
			.get( 'cart', {
				headers: { Cookie: req.headers.cookie },
			} )
			.then( ( { data } ) => data )
	);
	await queryClient.prefetchQuery( 'checkout', () =>
		axios
			.get( 'checkout', {
				headers: { Cookie: req.headers.cookie },
			} )
			.then( ( { data } ) => data )
	);

	return { props: { dehydratedState: dehydrate( queryClient ) } };
}
