import { useProducts, getProducts } from '../hooks';
import { QueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { dehydrate } from 'react-query/hydration';
import { Product } from '../components';
import Link from 'next/link';
import { useApp } from '../components/app/context';

export default function Home() {
	const { setCartIsOpen } = useApp();
	const { products } = useProducts();
	const { push } = useRouter();
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
								? onClick().then( () => setCartIsOpen( true ) )
								: push( `/product/${ product.slug }` )
						}
					/>
				</Product>
			) ) }
		</ul>
	);
}

export async function getStaticProps() {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery( [ 'products', {} ], () =>
		getProducts( { per_page: 0 } )
	);
	return {
		props: {
			dehydratedState: dehydrate( queryClient ),
		},
		revalidate: 10,
	};
}
