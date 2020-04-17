'use strict'
const sendResponse = require('../common/sendResponse');

module.exports = function(sender_psid) {
  const response = {
    "text": `
Chatbot's name: Jay.
Chatbot for CBN students.
Developed in 2020, by jayremntB (aka Fukai).
This chatbot is open source. Everyone can contribute to improving its efficiency.
Repo: https://github.com/jayremntB/CBN-Supporter
`
};
  sendResponse(sender_psid, response);
}
