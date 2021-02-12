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
  console.log(params)
  response.status(204).send()
  let phone = '33644631275'
  db.query('SELECT * FROM command WHERE phone_vonage = ?', [phone], (error, dbResult) => {
    console.log(dbResult)
    if (error) {
      return result(error, null);
    } else {
      const phone_client = dbResult[dbResult.length -1].phone_client
      console.log(phone_client)
        sendSms(phone_client, params.text, params.to)
    }

  });
}

const sendSms = (phone, text, vonage_phone) => {
    vonage.channel.send(
      { "type": "sms", "number": phone },
      { "type": "sms", "number": vonage_phone },
      {
        "content": {
          "type": "text",
          "text": `${text}`
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


app.listen(port, () => console.log(`Server is running on port ${port}.`));
