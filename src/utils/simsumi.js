const request = require('request');
const sendResponse = require('../general/sendResponse');

module.exports = function(sender_psid, text) {
    request({
        "uri": `https://simsumi.herokuapp.com/api`,
        "qs": {"text": `${text}`, "lang": "vi"},
        "method": "GET"
    }, (err, res, body) => {
        const response = {
            "text": JSON.parse(body).success
        }
        sendResponse(sender_psid, response);
    });
}