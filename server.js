require("dotenv").config();
const stripe = require('stripe')(process.env.SECRET_KEY_STRIPE);
const express = require('express');
var path = require('path');
var app = express();

app.use('/apple', express.static(path.join(__dirname + '/apple-watch.jpg')));

// const stripe = require('stripe')(process.env.SECRET_KEY_STRIPE);

app.get('/', (req, res) => {
          res.sendFile(__dirname + '/public/index.html');
});

app.get('/success', (req, res) => {
          res.send("Payment succeeded!");
});

app.get('/cancelled', (req, res) => {
          res.send("Payment failed or was dropped, cancelled or some error occured.");
});

app.post('/checkout', async (req, res) => {
          const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
              line_items: [
                    {
                              price_data: {
                                        currency: 'inr',
                                        product_data: {
                                                  name: 'Apple Watch',
                                                  images: ['https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/watch-compare-se-202209_GEO_IN_FMT_WHH?wid=308&hei=364&fmt=jpeg&qlt=90&.v=1661557187191']
                                        },
                                        unit_amount: 2000000
                              },
                              quantity: 1
                    }
              ],
              mode: 'payment',
              success_url: 'http://payment.cyclic.app/success',
              cancel_url: 'http://payment.cyclic.app/cancelled'
          });

          res.redirect(303, session.url);
});

app.listen(8080, () => console.log("Server is listening on port 8080!"));
