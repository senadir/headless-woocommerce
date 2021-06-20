import React, { useState, useEffect } from 'react';
import {
	CardElement,
	useStripe,
	useElements,
	Elements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { axios, Emitter } from '../../utils';
import { useQueryClient } from 'react-query';

const promise = loadStripe( process.env.NEXT_PUBLIC_STRIPE_PUBLIC );

export default function StripeWrapper() {
	return (
		<Elements stripe={ promise }>
			<Stripe />
		</Elements>
	);
}

const Stripe = () => {
	const [ succeeded, setSucceeded ] = useState( false );
	const [ error, setError ] = useState( null );
	const [ processing, setProcessing ] = useState( '' );
	const [ disabled, setDisabled ] = useState( true );
	const queryClient = useQueryClient();
	const [ clientSecret, setClientSecret ] = useState( () => {
		return queryClient.getQueryData( 'checkout' ).extensions[
			'basic-stripe'
		]?.client_secret;
	} );
	const stripe = useStripe();
	const elements = useElements();

	useEffect( () => {
		const payStripe = async () => {
			try {
				const {
					paymentIntent,
					error,
				} = await stripe.confirmCardPayment( clientSecret, {
					payment_method: {
						card: elements.getElement( CardElement ),
					},
				} );
				if ( error ) {
					throw Error( error.message );
					setError( `Payment failed ${ error.message }` );
					return null;
				}
				return [
					{ key: 'stripe_source', value: paymentIntent.id },
					{ key: 'paymentMethod', value: 'basic-stripe' },
					{ key: 'paymentRequestType', value: 'cc' },
					{ key: 'wc-stripe-new-payment-method', value: false },
				];
			} catch ( e ) {
				console.log( e );
			}
		};
		try {
			Emitter.on( 'submit', payStripe );
		} catch ( e ) {
			console.log( e );
		}

		return () => Emitter.off( 'submit', payStripe );
	}, [ stripe, elements, clientSecret ] );
	const handleChange = async ( event ) => {
		// Listen for changes in the CardElement
		// and display any errors as the customer types their card details
		setDisabled( event.empty );
		setError( event.error ? event.error.message : '' );
	};

	return (
		<CardElement
			id="card-element"
			onChange={ handleChange }
			hidePostalCode={ false }
		/>
	);
};
