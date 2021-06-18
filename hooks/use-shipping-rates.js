import { useMutation, useQueryClient } from 'react-query';
import { axios } from '../utils';
import { useCart } from './';
import produce from 'immer';
export const useShippingRates = () => {
	const { shippingRates } = useCart();
	const queryClient = useQueryClient();
	const package_id = 0;
	const { mutate: selectRate } = useMutation(
		( rate_id ) =>
			axios.post( 'cart/select-shipping-rate', {
				package_id,
				rate_id,
			} ),
		{
			onMutate: ( rateId ) =>
				queryClient.setQueryData( 'cart', ( cart ) => {
					return produce( cart, ( nextCart ) => {
						const selectedRateIndex = cart.shipping_rates[
							package_id
						].shipping_rates.findIndex(
							( rate ) => rate.rate_id === rateId
						);
						const currentlySelectedRateIndex = cart.shipping_rates[
							package_id
						].shipping_rates.findIndex(
							( rate ) => rate.selected === true
						);
						nextCart.shipping_rates[ package_id ].shipping_rates[
							currentlySelectedRateIndex
						].selected = false;
						nextCart.shipping_rates[ package_id ].shipping_rates[
							selectedRateIndex
						].selected = true;
					} );
				} ),
			onSuccess: ( { data: cart } ) =>
				queryClient.setQueryData( 'cart', cart ),
		}
	);
	const shippingMethods = shippingRates[ 0 ].shippingRates;

	return {
		selectRate,
		shippingMethods,
	};
};
