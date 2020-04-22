'use strict'
const sendResponse = require('../general/sendResponse');

module.exports = function(sender_psid) {
  const date = new Date();
  date.setHours(date.getHours() + 7); // App is deployed in heroku US +7(VN)
  const timeNow = {
    'hours': date.getHours(),
    'minutes': date.getMinutes()
  }

  // Estimate time to wake up if sleep now
  date.setMinutes(date.getMinutes() + 90 * 2 + 14);
  let timeEstimate = new Array(4);
  for (var i = 0; i < timeEstimate.length; i++) {
    date.setMinutes(date.getMinutes() + 90);
    timeEstimate[i] = {
      'hours': date.getHours(),
      'minutes': date.getMinutes()
    }
  }
  const response = [
    {
      "text": `Bây giờ là ${timeNow.hours} giờ ${timeNow.minutes} phút. Đây là những thời điểm mà cậu nên thức dậy:
+ ${timeEstimate[0].hours} giờ ${timeEstimate[0].minutes} phút
+ ${timeEstimate[1].hours} giờ ${timeEstimate[1].minutes} phút
+ ${timeEstimate[2].hours} giờ ${timeEstimate[2].minutes} phút
+ ${timeEstimate[3].hours} giờ ${timeEstimate[3].minutes} phút
để "có thể" tỉnh táo. Vì công thức cũng chỉ là công thức thôi, cậu muốn tỉnh táo thì cứ ngủ đủ 8 tiếng như người bình thường là ok nha :D`
    },
    {
      "text": "Cậu có thể vào trang https://sleepyti.me/ để tìm thời điểm nên ngủ nếu cậu muốn dậy vào lúc nào đó. Thằng coder lười lắm nên không code cái này đâu :("
    }
  ];
  sendResponse(sender_psid, response[0]);
  setTimeout(() => {
    sendResponse(sender_psid, response[1]);
  }, 1000);
}
