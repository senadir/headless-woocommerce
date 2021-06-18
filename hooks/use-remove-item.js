import { useMutation, useQueryClient } from 'react-query';
import { axios } from '../utils';

export const useRemoveItem = () => {
	const queryClient = useQueryClient();
	const { mutate: removeItem, isLoading } = useMutation(
		( key ) => {
			return axios.post( 'cart/remove-item', {
				key,
			} );
		},
		{
			onSuccess: ( { data: cart } ) => {
				queryClient.setQueryData( 'cart', cart );
			},
		}
	);
	return { removeItem, isLoading };
};
