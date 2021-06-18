import { useMutation, useQueryClient } from 'react-query';
import { axios } from '../utils';

export const useUpdateItem = () => {
	const queryClient = useQueryClient();
	const { mutate: updateItem, isLoading } = useMutation(
		( { key, quantity } ) => {
			return axios.post( 'cart/update-item', {
				key,
				quantity,
			} );
		},
		{
			onSuccess: ( { data: cart } ) => {
				queryClient.setQueryData( 'cart', cart );
			},
		}
	);
	return { updateItem, isLoading };
};
