import { App } from '../components';

export default function MyApp( { Component, pageProps } ) {
	return (
		<App dehydratedState={ pageProps.dehydratedState }>
			<Component { ...pageProps } />
		</App>
	);
}
