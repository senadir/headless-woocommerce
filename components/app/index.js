import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import 'tailwindcss/tailwind.css';
import { Cart } from '../';
import { AppProvider } from './context';
import { Navigation } from './navigation';

function App( { dehydratedState, children } ) {
	const [ queryClient ] = useState( () => new QueryClient() );
	return (
		<QueryClientProvider client={ queryClient }>
			<Hydrate state={ dehydratedState }>
				<AppProvider>
					<div className="min-h-screen bg-white">
						<Navigation />

						<div className="py-10">
							<main>
								<div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
									<Cart />
									{ children }
								</div>
							</main>
						</div>
					</div>
				</AppProvider>
			</Hydrate>
		</QueryClientProvider>
	);
}
export { App };
