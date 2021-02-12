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

router.use('/command', cors({ credentials: true, origin: process.env.ORIGIN_URL }), command)

// VONAGE

router.use('/search-number', cors({ credentials: true, origin: process.env.ORIGIN_URL }), async (req, res) => {
vonage.number.search(
  COUNTRY_CODE,
  {
    type: VONAGE_NUMBER_TYPE,
    pattern: NUMBER_SEARCH_CRITERIA,
    search_pattern: NUMBER_SEARCH_PATTERN,
    features: VONAGE_NUMBER_FEATURES
  },
  (err, res) => {
    if (err) {
      console.error(err)
    }
    else {
      console.log(`Here are ${res.numbers.length} of the ${res.count} matching numbers available for purchase:`)
      res.numbers.forEach((number) => {
        console.log(`Tel: ${number.msisdn} Cost: ${number.cost}`)
      })
    }
  }
)
})

router.use('/buy-number', cors({ credentials: true, origin: process.env.ORIGIN_URL }), async (req, res) => {
vonage.number.buy(COUNTRY_CODE, VONAGE_NUMBER, (err, res) => {
  if (err) {
    console.error(err)
  }
  else {
    console.log(JSON.stringify(res, null, 2))
  }
})
})

const sendSms = () => {
  vonage.channel.send(
    { "type": "sms", "number": TO_NUMBER },
    { "type": "sms", "number": FROM_NUMBER },
    {
      "content": {
        "type": "text",
        "text": "This is an SMS text message sent using the Messages API"
      }
    },
    (err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.log(data.message_uuid);
      }
    }
  );
}

// STRIPES

router.use('/create-customer', cors({ credentials: true, origin: process.env.ORIGIN_URL }), async (req, res) => {
  // Create a new customer object
  const customer = await stripe.customers.create({
    email: req.body.email,
    name: req.body.name
  });

  // Recommendation: save the customer.id in your database.
  res.send({ customer });
});

router.use('/create-subscription', cors({ credentials: true, origin: process.env.ORIGIN_URL }), async (req, res) => {
  try {
    await stripe.paymentMethods.attach(req.body.paymentMethodId, {
      customer: req.body.customerId,
    });
  } catch (error) {
    return res.status('402').send({ error: { message: error.message } });
  }
  await stripe.customers.update(
    req.body.customerId,
    {
      invoice_settings: {
        default_payment_method: req.body.paymentMethodId,
      },
    }
  );
  const subscription = await stripe.subscriptions.create({
    customer: req.body.customerId,
    items: [{ price: req.body.priceId }],
    expand: ['latest_invoice.payment_intent'],
  });
  res.send(subscription);
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