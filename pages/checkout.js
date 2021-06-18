import { QueryClient } from 'react-query';
import Link from 'next/link';
import { useMemo, useReducer, useCallback, useEffect } from 'react';
import { dehydrate } from 'react-query/hydration';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { axios } from '../utils';
import classnames from 'classnames';

import ShippingMethods from '../components/checkout/shipping-methods';
import Stripe from '../components/checkout/stripe';
import { useCart, useCheckout } from '../hooks';
import * as Yup from 'yup';
import { useRouter } from 'next/router';

const countries = {
	DZ: 'Algeria',
	CA: 'Canada',
	DE: 'Germany',
	NZ: 'New Zealand',
	PL: 'Poland',
	RO: 'Romania',
	ES: 'Spain',
	GB: 'United Kingdom (UK)',
	US: 'United States (US)',
};
const states = {
	DZ: {
		'DZ-01': 'Adrar',
		'DZ-02': 'Chlef',
		'DZ-03': 'Laghouat',
		'DZ-04': 'Oum El Bouaghi',
		'DZ-05': 'Batna',
		'DZ-06': 'Béjaïa',
		'DZ-07': 'Biskra',
		'DZ-08': 'Béchar',
		'DZ-09': 'Blida',
		'DZ-10': 'Bouira',
		'DZ-11': 'Tamanghasset',
		'DZ-12': 'Tébessa',
		'DZ-13': 'Tlemcen',
		'DZ-14': 'Tiaret',
		'DZ-15': 'Tizi Ouzou',
		'DZ-16': 'Algiers',
		'DZ-17': 'Djelfa',
		'DZ-18': 'Jijel',
		'DZ-19': 'Sétif',
		'DZ-20': 'Saïda',
		'DZ-21': 'Skikda',
		'DZ-22': 'Sidi Bel Abbès',
		'DZ-23': 'Annaba',
		'DZ-24': 'Guelma',
		'DZ-25': 'Constantine',
		'DZ-26': 'Médéa',
		'DZ-27': 'Mostaganem',
		'DZ-28': 'M’Sila',
		'DZ-29': 'Mascara',
		'DZ-30': 'Ouargla',
		'DZ-31': 'Oran',
		'DZ-32': 'El Bayadh',
		'DZ-33': 'Illizi',
		'DZ-34': 'Bordj Bou Arréridj',
		'DZ-35': 'Boumerdès',
		'DZ-36': 'El Tarf',
		'DZ-37': 'Tindouf',
		'DZ-38': 'Tissemsilt',
		'DZ-39': 'El Oued',
		'DZ-40': 'Khenchela',
		'DZ-41': 'Souk Ahras',
		'DZ-42': 'Tipasa',
		'DZ-43': 'Mila',
		'DZ-44': 'Aïn Defla',
		'DZ-45': 'Naama',
		'DZ-46': 'Aïn Témouchent',
		'DZ-47': 'Ghardaïa',
		'DZ-48': 'Relizane',
	},
	CA: {
		AB: 'Alberta',
		BC: 'British Columbia',
		MB: 'Manitoba',
		NB: 'New Brunswick',
		NL: 'Newfoundland and Labrador',
		NT: 'Northwest Territories',
		NS: 'Nova Scotia',
		NU: 'Nunavut',
		ON: 'Ontario',
		PE: 'Prince Edward Island',
		QC: 'Quebec',
		SK: 'Saskatchewan',
		YT: 'Yukon Territory',
	},
	NZ: {
		NL: 'Northland',
		AK: 'Auckland',
		WA: 'Waikato',
		BP: 'Bay of Plenty',
		TK: 'Taranaki',
		GI: 'Gisborne',
		HB: 'Hawke’s Bay',
		MW: 'Manawatu-Wanganui',
		WE: 'Wellington',
		NS: 'Nelson',
		MB: 'Marlborough',
		TM: 'Tasman',
		WC: 'West Coast',
		CT: 'Canterbury',
		OT: 'Otago',
		SL: 'Southland',
	},
	RO: {
		AB: 'Alba',
		AR: 'Arad',
		AG: 'Argeș',
		BC: 'Bacău',
		BH: 'Bihor',
		BN: 'Bistrița-Năsăud',
		BT: 'Botoșani',
		BR: 'Brăila',
		BV: 'Brașov',
		B: 'București',
		BZ: 'Buzău',
		CL: 'Călărași',
		CS: 'Caraș-Severin',
		CJ: 'Cluj',
		CT: 'Constanța',
		CV: 'Covasna',
		DB: 'Dâmbovița',
		DJ: 'Dolj',
		GL: 'Galați',
		GR: 'Giurgiu',
		GJ: 'Gorj',
		HR: 'Harghita',
		HD: 'Hunedoara',
		IL: 'Ialomița',
		IS: 'Iași',
		IF: 'Ilfov',
		MM: 'Maramureș',
		MH: 'Mehedinți',
		MS: 'Mureș',
		NT: 'Neamț',
		OT: 'Olt',
		PH: 'Prahova',
		SJ: 'Sălaj',
		SM: 'Satu Mare',
		SB: 'Sibiu',
		SV: 'Suceava',
		TR: 'Teleorman',
		TM: 'Timiș',
		TL: 'Tulcea',
		VL: 'Vâlcea',
		VS: 'Vaslui',
		VN: 'Vrancea',
	},
	ES: {
		C: 'A Coruña',
		VI: 'Araba/Álava',
		AB: 'Albacete',
		A: 'Alicante',
		AL: 'Almería',
		O: 'Asturias',
		AV: 'Ávila',
		BA: 'Badajoz',
		PM: 'Baleares',
		B: 'Barcelona',
		BU: 'Burgos',
		CC: 'Cáceres',
		CA: 'Cádiz',
		S: 'Cantabria',
		CS: 'Castellón',
		CE: 'Ceuta',
		CR: 'Ciudad Real',
		CO: 'Córdoba',
		CU: 'Cuenca',
		GI: 'Girona',
		GR: 'Granada',
		GU: 'Guadalajara',
		SS: 'Gipuzkoa',
		H: 'Huelva',
		HU: 'Huesca',
		J: 'Jaén',
		LO: 'La Rioja',
		GC: 'Las Palmas',
		LE: 'León',
		L: 'Lleida',
		LU: 'Lugo',
		M: 'Madrid',
		MA: 'Málaga',
		ML: 'Melilla',
		MU: 'Murcia',
		NA: 'Navarra',
		OR: 'Ourense',
		P: 'Palencia',
		PO: 'Pontevedra',
		SA: 'Salamanca',
		TF: 'Santa Cruz de Tenerife',
		SG: 'Segovia',
		SE: 'Sevilla',
		SO: 'Soria',
		T: 'Tarragona',
		TE: 'Teruel',
		TO: 'Toledo',
		V: 'Valencia',
		VA: 'Valladolid',
		BI: 'Biscay',
		ZA: 'Zamora',
		Z: 'Zaragoza',
	},
	US: {
		AL: 'Alabama',
		AK: 'Alaska',
		AZ: 'Arizona',
		AR: 'Arkansas',
		CA: 'California',
		CO: 'Colorado',
		CT: 'Connecticut',
		DE: 'Delaware',
		DC: 'District Of Columbia',
		FL: 'Florida',
		GA: 'Georgia',
		HI: 'Hawaii',
		ID: 'Idaho',
		IL: 'Illinois',
		IN: 'Indiana',
		IA: 'Iowa',
		KS: 'Kansas',
		KY: 'Kentucky',
		LA: 'Louisiana',
		ME: 'Maine',
		MD: 'Maryland',
		MA: 'Massachusetts',
		MI: 'Michigan',
		MN: 'Minnesota',
		MS: 'Mississippi',
		MO: 'Missouri',
		MT: 'Montana',
		NE: 'Nebraska',
		NV: 'Nevada',
		NH: 'New Hampshire',
		NJ: 'New Jersey',
		NM: 'New Mexico',
		NY: 'New York',
		NC: 'North Carolina',
		ND: 'North Dakota',
		OH: 'Ohio',
		OK: 'Oklahoma',
		OR: 'Oregon',
		PA: 'Pennsylvania',
		RI: 'Rhode Island',
		SC: 'South Carolina',
		SD: 'South Dakota',
		TN: 'Tennessee',
		TX: 'Texas',
		UT: 'Utah',
		VT: 'Vermont',
		VA: 'Virginia',
		WA: 'Washington',
		WV: 'West Virginia',
		WI: 'Wisconsin',
		WY: 'Wyoming',
		AA: 'Armed Forces (AA)',
		AE: 'Armed Forces (AE)',
		AP: 'Armed Forces (AP)',
	},
};
const checkoutSchema = {
	contact_step: Yup.object( {
		billing_address: Yup.object( {
			email: Yup.string().email( 'Invalid email' ).required( 'Required' ),
		} ),
	} ),
	address_step: Yup.object( {
		shipping_address: Yup.object( {
			first_name: Yup.string().required( 'Required' ),
			last_name: Yup.string().required( 'Required' ),
			address_1: Yup.string().required( 'Required' ),
			postcode: Yup.string().required( 'Required' ),
			country: Yup.string().required( 'Required' ),
			state: Yup.string().required( 'Required' ),
			city: Yup.string().required( 'Required' ),
		} ),
	} ),
	shipping_step: Yup.object( {} ),
	payment_step: Yup.object( {} ),
};

const stepsReducer = ( state, action ) => {
	const activeStepIndex = state.findIndex(
		( step ) => step.status === 'current'
	);
	switch ( action.type ) {
		case 'FORWARD':
			let newState = state.map( ( step, index ) => {
				if ( index <= activeStepIndex ) {
					return { ...step, status: 'complete' };
				}
				if ( index === activeStepIndex + 1 ) {
					return { ...step, status: 'current' };
				}
				return { ...step, status: 'upcoming' };
			} );
			return newState;
		case 'BACKWARD':
			newState = state.map( ( step, index ) => {
				if ( index >= activeStepIndex ) {
					return { ...step, status: 'upcoming' };
				}
				if ( index === activeStepIndex - 1 ) {
					return { ...step, status: 'current' };
				}
				return { ...step, status: 'complete' };
			} );
			return newState;
	}
};

const initialSteps = [
	{ id: 'contact_step', name: 'Contact', href: '#', status: 'current' },
	{ id: 'address_step', name: 'Address', href: '#', status: 'upcoming' },
	{
		id: 'shipping_step',
		name: 'Shipping',
		href: '#',
		status: 'upcoming',
	},
	{ id: 'payment_step', name: 'Payment', href: '#', status: 'upcoming' },
];

export default function Checkout() {
	const { needsShipping } = useCart();
	const { push } = useRouter();
	const initSteps = useCallback(
		( providedSteps ) =>
			needsShipping
				? providedSteps
				: providedSteps.filter(
						( step ) => step.id !== 'shipping_step'
				  ),
		[ needsShipping ]
	);
	const {
		placeOrder,
		updateCheckout,
		billing_address,
		shipping_address,
		errors: checkoutErrors,
	} = useCheckout();

	const [ steps, dispatch ] = useReducer(
		stepsReducer,
		initialSteps,
		initSteps
	);
	const currentStep = useMemo(
		() => steps.find( ( step ) => step.status === 'current' ).id,
		[ steps ]
	);
	const { ...cart } = useCart();
	if ( ! cart?.items?.length ) {
		return (
			<div className="py-24 lg:py-32">
				<div className="relative z-10 max-w-7xl mx-auto pl-4 pr-8 sm:px-6 lg:px-8">
					<h2 className="text-3xl font-extrabold tracking-tight text-warm-gray-900 sm:text-3xl lg:text-4xl">
						Your cart is empty, so you can&apos;t checkout.
					</h2>
					<p className="mt-6 text-xl text-warm-gray-500 max-w-3xl">
						Why don&apos;t you try adding{ ' ' }
						<Link href="/">
							<a className="text-purple-800 font-medium underline">
								some products
							</a>
						</Link>{ ' ' }
						to your cart.
					</p>
				</div>
			</div>
		);
	}
	return (
		<div className="lg:grid lg:grid-cols-12">
			<Formik
				validationSchema={ checkoutSchema[ currentStep ] }
				initialValues={ {
					billing_address,
					shipping_address,
					should_create_account: false,
				} }
				onSubmit={ ( values ) => {
					placeOrder( { values } );
				} }
			>
				{ ( {
					isSubmitting,
					setFieldValue,
					validateForm,
					errors,
					touched,
					isValid,
					values,
				} ) => (
					<Form
						action="#"
						method="POST"
						className="space-y-6 sm:px-4 px-2 lg:col-span-6"
					>
						<div className="sm:overflow-hidden px-2">
							<nav aria-label="Progress">
								<ol className="space-y-4 md:flex md:space-y-0 md:space-x-8">
									{ steps.map( ( step, key ) => (
										<li
											key={ step.name }
											className="md:flex-1"
										>
											{ step.status === 'complete' ? (
												<a
													href={ step.href }
													className="group pl-4 py-2 flex flex-col border-l-4 border-purple-600 hover:border-purple-800 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4"
												>
													<span className="text-xs text-purple-600 font-semibold tracking-wide uppercase group-hover:text-purple-800">
														{ `0${ key }.` }
													</span>
													<span className="text-sm font-medium">
														{ step.name }
													</span>
												</a>
											) : step.status === 'current' ? (
												<a
													href={ step.href }
													className="pl-4 py-2 flex flex-col border-l-4 border-purple-600 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4"
													aria-current="step"
												>
													<span className="text-xs text-purple-600 font-semibold tracking-wide uppercase">
														{ `0${ key }.` }
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
														{ `0${ key }.` }
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
							{ currentStep === 'contact_step' && (
								<div className="py-4 space-y-2 sm:py-6">
									<div>
										<h3 className="text-lg leading-6 font-medium text-gray-900">
											Contact Information
										</h3>
										<p className="mt-1 text-sm text-gray-500">
											We use your email to keep you
											updated about your order status.
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
												className={ classnames(
													'mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm',
													{
														'border-red-700 text-red-700 focus:ring-red-500 focus:border-red-500':
															touched
																.billing_address
																?.email &&
															errors
																.billing_address
																?.email,
													}
												) }
											/>
											<ErrorMessage
												name="billing_address.email"
												component="p"
												className="mt-1 block text-xs text-red-700"
											/>
										</div>
										<div className="flex items-start col-span-12">
											<div className="h-5 flex items-center">
												<Field
													id="create_customer_account"
													name="create_customer_account"
													type="checkbox"
													className="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
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
							) }

							{ /* End step */ }
							{ /* Start Step*/ }
							{ currentStep === 'address_step' && (
								<div className="py-4 space-y-2 sm:py-6">
									<div>
										<h3 className="text-lg leading-6 font-medium text-gray-900">
											Shipping Address
										</h3>
										<p className="mt-1 text-sm text-gray-500">
											We use your email to keep you
											updated about your order status.
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
												className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
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
												className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
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
												className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
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
												className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
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
												onChange={ ( { target } ) => {
													setFieldValue(
														'shipping_address.country',
														target.value
													);
													setFieldValue(
														'shipping_address.state',
														states[
															target.value
														] &&
															Object.keys(
																states[
																	target.value
																]
															)[ 0 ]
													);
												} }
												className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
											>
												{ Object.entries(
													countries
												).map(
													( [ code, country ] ) => (
														<option
															value={ code }
															key={ code }
														>
															{ country }
														</option>
													)
												) }
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
												className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
												type="text"
												name="shipping_address.city"
												id="shipping_address.city"
											/>
										</div>
										<div className="col-span-6 sm:col-span-3">
											<label
												htmlFor="shipping_address.state"
												className="block text-sm font-medium text-gray-700"
											>
												State
											</label>
											{ states[
												values.shipping_address.country
											] ? (
												<Field
													id="shipping_address.state"
													as="select"
													name="shipping_address.state"
													autoComplete="address-level1"
													className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
												>
													{ Object.entries(
														states[
															values
																.shipping_address
																.country
														]
													).map(
														( [ code, state ] ) => (
															<option
																key={ code }
																value={ code }
															>
																{ state }
															</option>
														)
													) }
												</Field>
											) : (
												<Field
													id="shipping_address.state"
													name="shipping_address.state"
													autoComplete="address-level1"
													className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
													type="text"
												/>
											) }
										</div>

										<div className="col-span-6 sm:col-span-3">
											<label
												htmlFor="billing_address.phone"
												className="block text-sm font-medium text-gray-700"
											>
												Phone
											</label>
											<Field
												autoComplete="tel"
												autoCorrect="off"
												role="combobox"
												aria-autocomplete="list"
												aria-expanded="false"
												aria-required="true"
												className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
												type="tel"
												name="billing_address.phone"
												id="billing_address.phone"
											/>
										</div>
									</div>
								</div>
							) }
							{ /* End step */ }
							{ /* Start Step*/ }
							{ currentStep === 'shipping_step' && (
								<div className="py-4 space-y-2 sm:py-6">
									<div>
										<h3 className="text-lg leading-6 font-medium text-gray-900">
											Shipping Method
										</h3>
									</div>

									<ShippingMethods />
								</div>
							) }
							{ /* End step */ }
							{ /* Start Step*/ }
							{ currentStep === 'payment_step' && (
								<div className="py-4 space-y-2 sm:py-6">
									<div>
										<h3 className="text-lg leading-6 font-medium text-gray-900">
											Payment method
										</h3>
									</div>

									<Stripe />
								</div>
							) }
							{ /* End step */ }

							<div className="py-3 text-right">
								{ steps[ 0 ].status !== 'current' && (
									<button
										type="button"
										className="border border-transparent rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-gray-900 mr-4"
										onClick={ () =>
											dispatch( { type: 'BACKWARD' } )
										}
									>
										Previous Step
									</button>
								) }

								<button
									type="button"
									className={ classnames(
										'bg-purple-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500',
										{
											'pointer-events-none bg-gray-300 hover:bg-gray-300 focus:ring-gray-300':
												! isValid || isSubmitting,
										}
									) }
									disabled={ ! isValid || isSubmitting }
									onClick={ () =>
										currentStep !== 'payment_step'
											? validateForm()
													.then( () => {
														if ( isValid ) {
															return updateCheckout(
																{
																	values,
																}
															);
														}
													} )
													.then( () =>
														dispatch( {
															type: 'FORWARD',
														} )
													)
													.catch( () =>
														console.log(
															checkoutErrors
														)
													)
											: placeOrder( {
													values,
											  } )
													.then( () =>
														push( '/thank-you' )
													)
													.catch( ( e ) =>
														console.log( e )
													)
									}
								>
									{ currentStep === 'payment_step'
										? 'Place Order'
										: 'Next Step' }
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
