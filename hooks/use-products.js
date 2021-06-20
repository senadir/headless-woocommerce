import { useQuery } from 'react-query';
import { axios } from '../utils';

export const useProducts = ( params = {} ) => {
	const { data: products } = useQuery( [ 'products', params ], () =>
		getProducts( { per_page: 0, ...params } )
	);
	return {
		products,
	};
};

export const getProducts = async ( params ) => {
	const { data: products } = await axios.get( 'products', { params } );
	return products;
};
