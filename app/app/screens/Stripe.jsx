import React, {useEffect, useState} from 'react';
import {Text, View} from "react-native"
import { StripeProvider } from '@stripe/stripe-react-native';

const Stripe = () => {
    const [publishableKey, setPublishableKey] = useState("");

    const fetchPublishableKey = async () => {
        //const key = await fetchKey();
        //setPublishableKey(key);
    };

    useEffect(() => {
        fetchPublishableKey();
    }, []);

    return(
        <StripeProvider
            publishableKey={publishableKey}
            merchantIdentifier="merchant.identifier" // required for Apple Pay
            urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
        >
            <Text>
                stripe
            </Text>
        </StripeProvider>
    )
}

export default Stripe;