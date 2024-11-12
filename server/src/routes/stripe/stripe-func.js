import Stripe from 'stripe';
const stripe = new Stripe('your-secret-key', { apiVersion: '2023-08-16' });

const intent = async (req, res) => {
    try{
        let data = req.body;
        const customer = await stripe.customers.create({
            email: data.email
        });
        const ephemeralKey = await stripe.ephemeralKeys.create(
            {customer: customer.id},
            {apiVersion: '2024-06-20'}
        );

        const paymentIntent = await stripe.paymentIntents.create({
            amount: 12.90,
            currency: 'brl',
            customer: customer.id,
        });
    }
    catch(e) {

    }
}



export {intent};