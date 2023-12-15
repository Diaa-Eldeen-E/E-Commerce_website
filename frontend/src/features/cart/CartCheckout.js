import React, { useState } from 'react';
import axios from "axios";
import { Button, Form } from "react-bootstrap";

import
{
    PaymentElement,
    Elements,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';



const CheckoutForm = () =>
{
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState(null);

    const handleSubmit = async (event) =>
    {
        event.preventDefault();

        if (elements == null)
        {
            return;
        }

        // Trigger form validation and wallet collection
        const { error: submitError } = await elements.submit();
        if (submitError)
        {
            // Show error to your customer
            setErrorMessage(submitError.message);
            return;
        }

        // Create the PaymentIntent and obtain clientSecret from your server endpoint
        const res = await axios.post('/api/create-intent');
        console.log(res);
        const { client_secret: clientSecret } = res?.data;

        console.log('got the client secret: ', clientSecret);

        const { error } = await stripe.confirmPayment({
            //`Elements` instance that was used to create the Payment Element
            elements,
            clientSecret,
            confirmParams: {
                return_url: 'http://localhost:3000/order/123/complete',
            },
        });

        if (error)
        {
            // This point will only be reached if there is an immediate error when
            // confirming the payment. (for example, payment details incomplete)
            setErrorMessage(error.message);
        } else
        {
            // The customer will be redirected to `return_url`. 
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <PaymentElement />
            <Button type="submit" disabled={!stripe || !elements}>
                Pay
            </Button>
            {/* Show error message to your customers */}
            {errorMessage && <div>{errorMessage}</div>}
        </Form>
    );

};


export default CheckoutForm;