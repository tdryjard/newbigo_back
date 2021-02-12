const app = require('express')();
require('dotenv').config();
const bodyParser = require('body-parser');
const api = require('./routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');

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
}


app.listen(port, () => console.log(`Server is running on port ${port}.`));
