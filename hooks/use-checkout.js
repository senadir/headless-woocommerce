import { useMutation, useQuery, useQueryClient } from 'react-query';
import { axios, Emitter } from '../utils';
export const useCheckout = () => {
	const queryClient = useQueryClient();
	const { data: checkout } = useQuery(
		'checkout',
		() => axios.get( 'checkout' ).then( ( { data } ) => data ),
		{
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchIntervalInBackground: false,
		}
	);
	const { mutateAsync: placeOrder, error: placeErrors } = useMutation(
		async ( { values: { billing_address, shipping_address } } ) => {
			try {
				const [ stripe ] = await Emitter.emit( 'submit' );
				await axios.post( 'checkout', {
					billing_address: {
						...checkout.billing_address,
						...checkout.shipping_address,
						...billing_address,
						...shipping_address,
					},
					shipping_address: {
						...checkout.shipping_address,
						...shipping_address,
					},
					payment_data: stripe,
					payment_method: 'basic-stripe',
				} );
			} catch ( e ) {
				console.log( e );
			}
		},
		{
			onSuccess: ( { data } ) => {
				queryClient.setQueryData( 'checkout', data );
				queryClient.removeQueries( 'cart' );
			},
		}
	);

	const { mutateAsync: updateCheckout, error: updateErrors } = useMutation(
		async ( { values: { billing_address, shipping_address } } ) => {
			return axios.post( 'cart/update-customer', {
				billing_address: {
					...checkout.billing_address,
					...checkout.shipping_address,
					...billing_address,
					...shipping_address,
				},
				shipping_address: {
					...checkout.shipping_address,
					...shipping_address,
				},
			} );
		},
		{
			onSuccess: ( { data } ) => queryClient.setQueryData( 'cart', data ),
		}
	);
	return {
		...checkout,
		placeOrder,
		updateCheckout,
		errors: { ...placeErrors, ...updateErrors },
	};
};
