import { useMutation, useQueryClient } from 'react-query';
import { axios } from '../utils';

export const useAddItem = () => {
	const queryClient = useQueryClient();
	const { mutateAsync: addItem, isLoading } = useMutation(
		( id, quantity = 1 ) =>
			axios.post( 'cart/add-item', {
				id,
				quantity,
			} ),
		{
			onSuccess: ( { data: cart } ) => {
				queryClient.setQueryData( 'cart', cart );
			},
		}
	);
	return { addItem, isLoading };
};
