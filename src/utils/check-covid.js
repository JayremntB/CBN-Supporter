'use strict'
const request = require('request');
const sendResponse = require('../general/sendResponse.js')

module.exports = function (sender_psid) {
  let response = {
    "text": "Đang lấy dữ liệu...",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Menu",
        "payload": "menu",
        "image_url": ""
      }
    ]
  };
  // Fetch http://covid-rest.herokuapp.com/vietnam
  sendResponse(sender_psid, response);
  setTimeout(() => {
    request({
      "uri": "http://covid-rest.herokuapp.com/vietnam",
      "method": "GET",
    }, (err, res, body) => {
      if(err) {
        response = {
          "text": "Đang có trục trặc, tớ không lấy được dữ liệu rồi :( Hãy quay lại sau nha T.T"
        };
        sendResponse(sender_psid, response);
      }
      else {
        const data = JSON.parse(body).data[0];
        if(data.total_death === "") data.total_death = "0";
        if(data.new_cases === "") data.new_cases = "0";
        response.text = `Tình hình dịch bệnh hiện tại:
- Tổng ca nhiễm: ${data.total_cases}
- Số ca nhiễm mới: ${data.new_cases}
- Số ca tử vong: ${data.total_death}
- Số ca hồi phục: ${data.total_recovered}
Ở yên trong nhà, giữ cho mình một sức khoẻ dẻo dai, luyện tập thể dục và rửa tay thường xuyên nha <3`
        sendResponse(sender_psid, response);
      }
    });
  }, 500);
}
