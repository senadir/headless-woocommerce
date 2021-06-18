import React, { useState, useEffect } from 'react';
import {
	CardElement,
	useStripe,
	useElements,
	Elements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { axios, Emitter } from '../../utils';

const promise = loadStripe(
	'pk_test_51HWj7AEtLFnZrPHD2leaTB9x9qG8mjRVW8peu3kbT8WcUuxxkANzAQfKwYJzRa0F4MOG66aZI4zwUOBetfkC1Tkg00oeP0lVFh'
);

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
	const [ clientSecret, setClientSecret ] = useState( '' );
	const stripe = useStripe();
	const elements = useElements();

	useEffect( () => {
		// Create PaymentIntent as soon as the page loads
		axios.post( 'stripe', {} ).then( ( { data } ) => {
			setClientSecret( data.client_secret );
		} );
	}, [] );

	useEffect( () => {
		const payStripe = async () => {
			const { paymentIntent, error } = await stripe.confirmCardPayment(
				clientSecret,
				{
					payment_method: {
						card: elements.getElement( CardElement ),
					},
				}
			);
			if ( error ) {
				setError( `Payment failed ${ error.message }` );
				return null;
			}
			return [
				{ key: 'stripe_source', value: paymentIntent.id },
				{ key: 'paymentMethod', value: 'basic-stripe' },
				{ key: 'paymentRequestType', value: 'cc' },
				{ key: 'wc-stripe-new-payment-method', value: false },
			];
		};
		Emitter.on( 'submit', payStripe );

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
