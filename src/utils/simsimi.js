const request = require('request');

module.exports = function(sender_psid, text) {
    request({
        "uri": `https://simsumi.herokuapp.com/api`,
        "qs": {"text": `${text}`, "lang": "vi"},
        "method": "GET"
    }, (err, res, body) => {
        const response = {
            "text": JSON.parse(body).success
        }
        SimsimiResponse(sender_psid, response);
    });
}

function SimsimiResponse(sender_psid, response) {
    let request_body = {
      "recipient": {
        "id": sender_psid
      },
      "messaging_type": "RESPONSE",
      "message": response,
      "persona_id": 275244647115922
    }
    request({
      "uri": "https://graph.facebook.com/v6.0/me/messages",
    //   "qs": { "access_token": process.env.TEST_PAGE_ACCESS_TOKEN },
      "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
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