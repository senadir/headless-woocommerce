import { camelCase } from 'changecase-objects';
import { useQuery } from 'react-query';
import { axios } from '../utils';

export const useCart = () => {
	const {
		data: cart,
		isLoading: cartIsLoading,
		isSuccess: cartLoaded,
	} = useQuery( 'cart', getCart );

	return { ...camelCase( cart ), cartIsLoading, cartLoaded };
};

export const getCart = async () => {
	const { data: cart } = await axios.get( `cart` );
	return cart;
};
