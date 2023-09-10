require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const verifiedNumber = process.env.VERIFIED_NUMBER;
const client = require("twilio")(accountSid, authToken);

const sendSms = (body, phoneNumber = verifiedNumber) => {
  client.messages
    .create({
      body: body,
      from: twilioNumber,
      to: phoneNumber,
    })
    .then((message) => console.log("SMS SENT"))
    .catch((error) => console.log(error));
};

module.exports = {
  sendSms,
};
