import axios from 'axios';

const instance = axios.create( {
	baseURL: process.env.NEXT_PUBLIC_STORE_API,
	withCredentials: true,
} );

let nonce = '';

instance.interceptors.request.use(
	function ( config ) {
		if ( nonce ) {
			config.headers = {
				...config.headers,
				'X-WC-Store-API-Nonce': nonce,
			};
		}

		return config;
	},
	function ( error ) {
		// Do something with request error
		return Promise.reject( error );
	}
);

// Add a response interceptor
instance.interceptors.response.use(
	function ( response ) {
		if ( response.headers[ 'x-wc-store-api-nonce' ] ) {
			nonce = response.headers[ 'x-wc-store-api-nonce' ];
		}

		return response;
	},
	function ( error ) {
		// Do something with response error
		return Promise.reject( error );
	}
);

export { instance as axios };
