import React from 'react';
import { useMutation, useQuery } from 'react-query';
import { axios, Emitter } from '../utils';
export default function useCheckout() {
	const { data: checkout } = useQuery( 'checkout', () =>
		axios.get( 'checkout' ).then( ( { data } ) => data )
	);
	const { mutate: placeOrder } = useMutation(
		async ( { values: { billing_address, shipping_address } } ) => {
			const [ stripe ] = await Emitter.emit( 'submit' );
			axios.post( 'checkout', {
				billing_address: {
					...billing_address,
					...shipping_address,
					state: 'DZ-31',
				},
				shipping_address: {
					...shipping_address,
					state: 'DZ-31',
				},
				payment_data: stripe,
				payment_method: 'basic-stripe',
			} );
		}
	);
	return {
		...checkout,
		placeOrder,
	};
}
