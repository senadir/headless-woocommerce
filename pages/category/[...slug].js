import { useProducts, getProducts } from '../../hooks';
import { QueryClient, useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { dehydrate } from 'react-query/hydration';
import { Product } from '../../components';
import Link from 'next/link';
import { axios } from '../../utils';
import classnames from 'classnames';

export default function Home() {
	const {
		query: { slug },
		isFallback,
	} = useRouter();
	const { products } = useProducts( { category: slug[ 1 ] } );
	const { push } = useRouter();
	if ( ! products ) {
		return null;
	}
	return (
		<ul className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
			{ products.map( ( product ) => (
				<Product
					product={ product }
					key={ product.id }
					className="relative"
				>
					<Link href={ `/product/${ product.slug }` } passHref>
						<Product.Image
							as="a"
							className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 overflow-hidden"
						/>
					</Link>
					<div className="flex justify-between items-end">
						<Link href={ `/product/${ product.slug }` }>
							<Product.Title
								as="a"
								className="mt-2 block text-sm font-medium text-gray-900 truncate"
							/>
						</Link>
						<Product.Price className="block text-sm font-medium text-gray-500 pointer-events-none" />
					</div>

					<Product.AddToCart
						className="text-sm font-medium text-gray-900 underline"
						onClick={ ( onClick ) =>
							product.type === 'simple'
								? onClick()
								: push( `/product/${ product.slug }` )
						}
					/>
				</Product>
			) ) }
		</ul>
	);
}

export async function getStaticProps( { params } ) {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(
		[ 'products', { category: params.slug[ 1 ] } ],
		() => getProducts( { category: params.slug[ 1 ] } )
	);
	return {
		props: {
			dehydratedState: dehydrate( queryClient ),
		},
	};
}

export async function getStaticPaths() {
	const { data: categories } = await axios.get( `products/categories` );

	return {
		paths: categories.map( ( category ) => ( {
			params: { slug: [ category.slug, `${ category.id }` ] },
		} ) ),
		fallback: false, // See the "fallback" section below
	};
}
