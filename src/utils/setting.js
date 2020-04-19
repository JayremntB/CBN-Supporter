const sendResponse = require('../general/sendResponse');

const dbName = 'database-for-cbner';
let response = {
  "text": "Thời khoá biểu lớp cậu chưa được cập nhật do thiếu sót bên kĩ thuật, hãy liên hệ thằng dev qua phần Thông tin và cài đặt nhé!"
};
module.exports = {
  handleMessage: handleMessage,
  handlePostback: handlePostback
}

async function handleMessage(client, sender_psid, groupModify) {
  if(checkGroup(sender_psid, groupModify)) {
    const scheduleData = await client.db(dbName).collection('schedule').findOne({ group: groupModify });
    console.log(scheduleData);
    if(scheduleData) {
      console.log("Found data");
      // add schedule to user-search data
      client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
        $set: {
          group: groupModify,
          main_schedule: scheduleData.schedule
        }
      }, () => {
        response.text = `Cập nhật thời khoá biểu lớp ${groupModify} thành công!`;
        sendResponse(sender_psid, response);
      });
    }
    else sendResponse(sender_psid, response);
  }
}

function handlePostback(client, sender_psid) {
  response.text = "Gõ setclass + tên lớp để bỏ qua bước gõ tên lớp khi bạn sử dụng tính năng tra thời khoá biểu\n(Ví dụ: setclass 11ti)";
  sendResponse(sender_psid, response);
  setTimeout(() => {
    response.text = "Đừng lo, khi cậu muốn tra lớp khác, tớ sẽ có một cái button để giúp cậu tra mà không ảnh hưởng đến lớp cậu đã cài đặt :D"
    sendResponse(sender_psid, response);
  }, 1000);
}

function checkGroup(sender_psid, group) {
  const checkArray = ['10t1', '10t2', '10l', '10h', '10si', '10ti', '10v1', '10v2', '10su', '10đ','10a1', '10a2', '11t', '11l', '11h', '11si', '11ti', '11v', '11su', '11đ','11c1','11c2', '11a1', '11a2', '12t', '12l', '12h', '12si', '12ti', '12v', '12su', '12đ', '12c1', '12c2', '12a1', '12a2'];
  if(checkArray.includes(group)) return true;
  else {
    const response = {
      "text": "Tên lớp không có trong danh sách :( Kiểm tra lại xem cậu có viết nhầm hay không nhé :^)"
    };
    sendResponse(sender_psid, response);
    return false;
  }
}
