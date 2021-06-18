import React, { useCallback } from 'react';
import { useShippingRates } from '../../hooks';
import { RadioGroup } from '@headlessui/react';
import { formatPrice, getCurrencyFromPriceResponse } from '../../utils';
import { useFormikContext } from 'formik';

function classNames( ...classes ) {
	return classes.filter( Boolean ).join( ' ' );
}

export default function ShippingMethods() {
	const { selectRate, shippingMethods } = useShippingRates();
	const { setFieldValue } = useFormikContext();
	const handleChange = useCallback(
		( rateId ) => {
			setFieldValue( 'shipping-method', rateId );
			selectRate( rateId );
		},
		[ setFieldValue, selectRate ]
	);
	return (
		<RadioGroup
			value={ shippingMethods.find( ( rate ) => rate.selected ).rateId }
			onChange={ handleChange }
		>
			<RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
			<div className="space-y-4">
				{ shippingMethods.map( ( rate ) => (
					<RadioGroup.Option
						key={ rate.rateId }
						value={ rate.rateId }
						className={ ( { active } ) =>
							classNames(
								active
									? 'ring-1 ring-offset-2 ring-indigo-500'
									: '',
								'relative block rounded-lg border border-gray-300 bg-white shadow-sm px-6 py-4 cursor-pointer hover:border-gray-400 sm:flex sm:justify-between focus:outline-none'
							)
						}
					>
						{ ( { checked } ) => (
							<>
								<div className="flex items-center">
									<div className="text-sm">
										<RadioGroup.Label
											as="p"
											className="font-medium text-gray-900"
										>
											{ rate.name }
										</RadioGroup.Label>
										<RadioGroup.Description
											as="div"
											className="text-gray-500"
										>
											<p className="sm:inline">Rate</p>
										</RadioGroup.Description>
									</div>
								</div>
								<RadioGroup.Description
									as="div"
									className="mt-2 flexjustify-center items-center text-sm sm:mt-0 sm:block sm:ml-4 sm:text-right"
								>
									<div className="font-medium text-gray-900">
										{ formatPrice(
											rate.price,
											getCurrencyFromPriceResponse( rate )
										) }
									</div>
								</RadioGroup.Description>
								<div
									className={ classNames(
										checked
											? 'border-indigo-500'
											: 'border-transparent',
										'absolute -inset-px rounded-lg border-2 pointer-events-none'
									) }
									aria-hidden="true"
								/>
							</>
						) }
					</RadioGroup.Option>
				) ) }
			</div>
		</RadioGroup>
	);
}
