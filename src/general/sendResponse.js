const request = require('request');

const TEST_PAGE_ACCESS_TOKEN = "EAAHUZB9Y5ZAYoBAKs55j6oJN7c9b8ugDWqhuXpzOFdRiU6R4utMX03nLLVa3VZCJXpYQJrJMoIJe0Fi7K2vkajsS3R22waFzCz4kI3CPNH7mxva1Ls1VOYGNGTUAqrBSZCUx0ZBpZAN8ZCZAZBn27s2z6rv7hBfElOn9tJsfwKAuiKuoLTHTErpWCPONNq45NDxAZD";
module.exports = function (sender_psid, response) {
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "messaging_type": "RESPONSE",
    "message": response
  }
  request({
    "uri": "https://graph.facebook.com/v6.0/me/messages",
    "qs": { "access_token": TEST_PAGE_ACCESS_TOKEN },
    // "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if(err) {
      console.error("Unable to send message:" + err);
    } else {
      console.log(`+ successfully sent message \n=================================`);
    }
  });
}
