const request = require('request');

const dbName = 'database-for-cbner';

module.exports = {
    response: response,
    changeLang: changeLang,
};

function response(userData, text) {
    request({
        "uri": `https://simsumi.herokuapp.com/api`,
        "qs": {"text": `${text}`, "lang": `${userData.simsimi_lang}`},
        "method": "GET"
    }, (err, res, body) => {
        const response = {
            "text": JSON.parse(body).success
        }
        SimsimiResponse(userData.sender_psid, response);
    });
}

function changeLang(client, userData, lang) {
    client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
        $set: {
            simsimi_lang: lang
        }
    }, () => {
        const response = {
            "text": ""
        };
        if(lang === "vi") response.text = "Ok rồi đấy :>";
        else response.text = "So you want me to speak English...\nGo ahead =)))";
        SimsimiResponse(userData.sender_psid, response);
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