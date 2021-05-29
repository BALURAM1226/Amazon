const stripe = require("stripe")("sk_test_51ItAJ3SCvcRdNxPbdzp8Rp90PwPjubF3oKWUeiidmlWO3UuIz8Oecl1S8AMtPrSyaRY8OrktyfZ4kQ1rJScE4E7700mrWFi2vd");
const express = require('express');
const app = express();
app.use(express.static('.'));

app.get('/', (req, res) => {
	res.send('Server Running');
});

const PORT = process.env.PORT || 3000;

const YOUR_DOMAIN = 'https://react-thgnk4.stackblitz.io/checkout';

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Stubborn Attachments',
            images: ['https://i.imgur.com/EHyR2nP.png'],
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  res.json({ id: session.id });
});

app.listen(PORT, () => console.log('Running on port 3000'));
