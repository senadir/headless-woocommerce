import { useProducts, getProducts } from '../hooks';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import { Product } from '../components';
import Link from 'next/link';

export default function Home() {
	const { products } = useProducts();
	return (
		<ul className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
			{ products.map( ( product, i ) => (
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
					<Link href={ `/product/${ product.slug }` }>
						<Product.Title
							as="a"
							className="mt-2 block text-sm font-medium text-gray-900 truncate"
						/>
					</Link>
					<Product.Price className="block text-sm font-medium text-gray-500 pointer-events-none" />
				</Product>
			) ) }
		</ul>
	);
}

export async function getStaticProps() {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery( 'products', getProducts );
	return {
		props: {
			dehydratedState: dehydrate( queryClient ),
		},
	};
}
