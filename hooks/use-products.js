import { useQuery } from 'react-query';
import { axios } from '../utils';

export const useProducts = () => {
	const { data: products } = useQuery( 'products', getProducts );
	return {
		products,
	};
};

export const getProducts = async () => {
	const { data: products } = await axios.get( `products` );
	return products;
};
