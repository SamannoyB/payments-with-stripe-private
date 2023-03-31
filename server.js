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
              line_items: [
                    {
                              price_data: {
                                        currency: 'inr',
                                        product_data: {
                                                  name: 'Apple Watch',
                                                  images: ['apple-watch.jpg']
                                        },
                                        unit_amount: 2000000
                              },
                              quantity: 1
                    }
              ],
              mode: 'payment',
              success_url: 'http://localhost:8080/success',
              cancel_url: 'http://localhost:8080/cancelled'
          });

          res.redirect(303, session.url);
});

app.listen(8080, () => console.log("Server is listening on port 8080!"));