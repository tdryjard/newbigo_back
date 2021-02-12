const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const router = express.Router();
const Vonage = require('@vonage/server-sdk')

const command = require('./command/command.route')

const vonage = new Vonage(
  {
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET
  },
  {
    debug: true
  }
)

router.use(cookieParser());

// ROUTES

const Command = function createCommand(command) {
  this.phone_vonage = command.phone_vonage;
  this.phone_client = command.phone_client;
  this.service = command.service;
  this.customer_id = command.customer_id;
}

router.use('/payment/paypal', cors({ credentials: true, origin: process.env.ORIGIN_URL }), async (req, result) => {
  
  searchNumber(result)
});

router.use('/command', cors({ credentials: true, origin: process.env.ORIGIN_URL }), command)

// VONAGE

const searchNumber = (result) => {
vonage.number.search(
  'US',
  {
    type: 'mobile-lvn',
    features: 'SMS',
  },
  (err, res) => {
    if (err) {
      console.error(err)
    }
    else {
      console.log(res)
      console.log(`Here are ${res.numbers.length} of the ${res.count} matching numbers available for purchase:`)
      res.numbers.forEach((number) => {
        console.log(`Tel: ${number.msisdn} Cost: ${number.cost}`)
      })
      buyNumber(res, result)
    }
  }
)
}

const buyNumber = (res, result) => {
  const phone = res.numbers[0].msisdn
  
vonage.number.buy('US', phone, (err, res) => {
  if (err) {
    console.error(err)
  }
  else {
    db.query('SELECT * FROM credit', (error, dbResult) => {
      console.log(dbResult)
      if(dbResult && dbResult[0]){
        const newPrice = dbResult[0].stock - 0.9
        db.query('UPDATE credit SET stock = ?', [`${newPrice}`], (error, dbResult) => {
          console.log(dbResult)
        });
      }
    });
    return result.status(200).send({
      text: 'Comande ok !',
      phone: phone
    });
  }
})
}

// STRIPES

router.use('/create-customer', cors({ credentials: true, origin: process.env.ORIGIN_URL }), async (req, res) => {
  // Create a new customer object
  const customer = await stripe.customers.create({
    phone: req.body.phone
  });

  // Recommendation: save the customer.id in your database.
  res.send({ customer });
});

router.use('/create-subscription', cors({ credentials: true, origin: process.env.ORIGIN_URL }), async (req, result) => {
  try {
    await stripe.paymentMethods.attach(req.body.paymentMethodId, {
      customer: req.body.customerId,
    });
  } catch (error) {
    return result.status('402').send({ error: { message: error.message } });
  }
  await stripe.customers.update(
    req.body.customerId,
    {
      invoice_settings: {
        default_payment_method: req.body.paymentMethodId,
      },
    }
  );
  const intent = await stripe.paymentIntents.create({
    amount: parseInt(5 * 100),
    currency: 'eur',
    customer: req.body.customerId,
    payment_method_types: ['card']
  });
  searchNumber(result)
});



router.use('/cancel-subscription', cors({ credentials: true, origin: process.env.ORIGIN_URL }), async (req, res) => {
  // Delete the subscription
  const deletedSubscription = await stripe.subscriptions.del(
    req.body.subscriptionId
  );
  res.send(deletedSubscription);
});

router.use('/cookie', cors({ credentials: true, origin: process.env.ORIGIN_URL }), function (req, res) {


  // Génération du jsonWebToken
  const token = jwt.sign('5', `${process.env.SECRET_KEY}`);

  res.cookie('token', token, { maxAge: (Date.now() / 1000 + (60 * 60 * 120)), httpOnly: true });
  res.send('cookie ok')
})

module.exports = router;