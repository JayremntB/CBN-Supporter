'use strict'
const sendResponse = require('../general/sendResponse');

let response = {
  "text": "",
  "quick_replies": [
    {
      "content_type": "text",
      "title": "Menu",
      "payload": "menu",
      "image_url": ""
    },
    {
      "content_type": "text",
      "title": "Đổi thời gian tiền giấc ngủ",
      "payload": "changeWindDownTime",
      "image_url": ""
    }
  ]
};

const responseDefault = [
  "Trung bình một người thường mất 14 phút để chìm vào giấc ngủ, một giấc ngủ đủ giấc sẽ kéo dài từ 3 đến 6 chu kỳ. Thời điểm tốt nhất bạn nên thức dậy chính là lúc giao thoa giữa 2 chu kỳ.",
  "Nếu có thể thức dậy vào lúc đó, đảm bảo bạn sẽ có một ngày tuyệt vời tràn đầy năng lượng!"
];

module.exports = function(sender_psid, textSplit, userData) {
  while(textSplit.length < 2) textSplit.push("6h");
  const time = textSplit[1].split("h");
  if(checkTime(sender_psid, time)) {
    const date = new Date();
    date.setHours(time[0]);
    date.setMinutes(time[1]);
    response.text = `Nếu muốn thức dậy lúc ${date.getHours()} giờ ${date.getMinutes()} phút, bạn nên ngủ vào những thời điểm sau:\n`;
    // Estimate time to sleep if wake up at that time
    date.setMinutes(date.getMinutes() - 90 * 6 - userData.wind_down_time);
    for(let i = 0; i < 4; i ++) {
      date.setMinutes(date.getMinutes() + 90);
      response.text += `+ ${date.getHours()} giờ ${date.getMinutes()} phút\n`;
    }
    sendResponse(sender_psid, response);
    setTimeout(() => {
      response.text = responseDefault[0];
      sendResponse(sender_psid, response);
      setTimeout(() => {
        response.text = responseDefault[1];
        sendResponse(sender_psid, response);
      }, 1000);
    }, 1000);
  }
}

function checkTime(sender_psid, time) {
  if(isNaN(time[0]) || isNaN(time[1]) || time[0] < 0 || time[0] > 24 || time[1] < 0 || time[1] > 60) {
    response.text = "Xin lỗi, tớ không hiểu thời gian bạn vừa nhập :(";
    sendResponse(sender_psid, response);
    return 0;
  }
  return 1;
}
