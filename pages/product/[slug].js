import { useRouter } from 'next/router';
import { QueryClient, useQuery } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { Product } from '../../components';
import { axios } from '../../utils';

export default function ProductPage() {
	const {
		query: { slug },
		isFallback,
	} = useRouter();
	const { data: product } = useQuery(
		[ 'product', { slug } ],
		async () =>
			await (
				await fetch(
					`${ process.env.NEXT_PUBLIC_STORE_API }/products/${ slug }`
				)
			 ).json()
	);
	if ( isFallback ) {
		return 'Loading...';
	}
	return (
		<Product product={ product } className="relative">
			<div className="mx-auto max-w-7xl w-full pt-16 pb-20 text-center lg:py-48 lg:text-left">
				<div className="px-4 lg:w-1/2 sm:px-8 xl:pr-16">
					<Product.Title
						as="h1"
						className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl"
					/>

					<Product.Description className="mt-3 max-w-md mx-auto text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl" />

					<Product.AddToCart className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 md:py-4 md:text-lg md:px-10" />
				</div>
			</div>
			<div className="relative w-full h-64 sm:h-72 md:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 lg:h-full">
				<Product.Image className="absolute inset-0 w-full h-full object-cover" />
			</div>
		</Product>
	);
}

export async function getStaticProps( { params } ) {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery( [ 'product', { slug: params.slug } ], () =>
		axios.get( `products/${ params.slug }` ).then( ( res ) => res.data )
	);
	return {
		props: {
			dehydratedState: dehydrate( queryClient ),
		},
	};
}

export async function getStaticPaths() {
	const { data: products } = await axios.get( `products?per_page=0` );

	return {
		paths: products.map( ( product ) => ( {
			params: { slug: product.slug },
		} ) ),
		fallback: false, // See the "fallback" section below
	};
}
