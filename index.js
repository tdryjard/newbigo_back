const app = require('express')();
require('dotenv').config();
const bodyParser = require('body-parser');
const api = require('./routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const db = require('./models/database')
const Vonage = require('@vonage/server-sdk')
const VONAGE_APPLICATION_PRIVATE_KEY_PATH = `./${process.env.VONAGE_APPLICATION_PRIVATE_KEY_PATH}`


const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
  applicationId: process.env.VONAGE_APP_ID,
  privateKey: VONAGE_APPLICATION_PRIVATE_KEY_PATH
})

const port = process.env.PORT || 8000

app.use(
    cors({
        origin: [
            process.env.ORIGIN_URL,
            'https://newbigo.com'
        ]
    })
)

app.use(cookieParser());

app.use(bodyParser.json({
    limit: '5mb'
}));

app.use(bodyParser.urlencoded({
    extended: true,
    limit: '5mb'
}));

app.use('/api', api);

app
  .route('/receipt-sms')
  .get(handleInboundSms)
  .post(handleInboundSms)

function handleInboundSms(request, response) {
  const params = Object.assign(request.query, request.body)
  console.log(params, 'params')
  response.status(204).send()
  let phone = '33644631275'
  db.query('SELECT * FROM command WHERE phone_vonage = ?', [params.to], (error, dbResult) => {
    console.log(dbResult)
    if (error) {
      return result(error, null);
    } else {
      const phone_client = dbResult[dbResult.length -1].phone_client
      console.log(phone_client)
      db.query('SELECT * FROM credit', (error, dbResult) => {
        console.log(dbResult)
        if(dbResult && dbResult[0]){
          const newPrice = dbResult[0].stock - 0.008
          db.query('UPDATE credit SET stock = ?', [`${newPrice}`], (error, dbResult) => {
            console.log(dbResult)
          });
        }
      });
        sendSms(phone_client, params.text, params.to)
    }
  });
}

app
  .route('/get-credit')
  .get(getCredit)

function getCredit (request, response) {
  db.query('SELECT * FROM credit', (error, dbResult) => {
    console.log(dbResult)
    if (error) {
      return result(error, null);
    } else {
      response.send(dbResult)
    }
  });
}

const sendSms = (phone, text, vonage_phone) => {
  vonage.message.sendSms(vonage_phone, '33676323576', text, {
    type: "unicode"
  }, (err, responseData) => {
    if (err) {
      console.log(err);
    } else {
      if (responseData.messages[0]['status'] === "0") {
        console.log(responseData)
        console.log(text)
        console.log(vonage_phone)
        console.log("Message sent successfully.");
        db.query('SELECT * FROM credit', (error, dbResult) => {
          console.log(dbResult)
          if(dbResult && dbResult[0]){
            const newPrice = dbResult[0].stock - 0.08
            db.query('UPDATE credit SET stock = ?', [`${newPrice}`], (error, dbResult) => {
              console.log(dbResult)
            });
          }
        });
      } else {
        console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
      }
    }
  })
  }


app.listen(port, () => console.log(`Server is running on port ${port}.`));
