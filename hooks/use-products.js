import { useQuery } from 'react-query';
import { axios } from '../utils';

export const useProducts = ( queryString ) => {
	const { data: products } = useQuery( 'products', () =>
		getProducts( queryString )
	);
	return {
		products,
	};
};

export const getProducts = async ( queryString ) => {
	const { data: products } = await axios.get(
		`products?per_page=0&${ queryString }`
	);
	return products;
};
