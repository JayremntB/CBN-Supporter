const sendResponse = require('../general/sendResponse');

let response = {
  "text": "Úi, tớ không kết nối với database được. Cậu hãy thử lại sau nha T.T"
};
module.exports = {
  handleMessage: handleMessage,
  handlePostback: handlePostback
}

function handleMessage(client, sender_psid, groupModify) {
  if(checkGroup(sender_psid, groupModify)) {
    const collectionSchedule = client.db(dbName).collection('schedule');
    collectionSchedule.findOne({ group: groupInput }, (err, data) => {
      console.log("Found data");
      // add schedule to user-search data
      const collectionUsersData = client.db(dbName).collection('users-data');
      collectionUsersData.updateOne({ sender_psid: sender_psid }, {
        $set: {
          group: {
            group: groupModify
          },
          main_schedule: data.schedule
        }
      }, (err, res) => {
        let response;
        if (err) {
          console.error("Could not setting data: \n" + err);
          sendResponse(sender_psid, response);
        } else {
          console.log("Setting data successfully!");
          response = stuff.searchScheduleAskDay;
          response.text = `Cập nhật thời khoá biểu lớp ${groupModify} thành công!`;
          sendResponse(sender_psid, response);
        }
      });
    }); // find schedule of groupInput
  }
}

function handlePostback(sender_psid) {
  response.text = "Gõ setclass + tên lớp để bỏ qua bước gõ tên lớp khi bạn sử dụng tính năng tra thời khoá biểu\n(Ví dụ: setclass 11ti)";
  sendResponse(sender_psid, response);
  setTimeout(() => {
    response.text = "Đừng lo, khi cậu muốn tra lớp khác, tớ sẽ có một cái button để giúp cậu tra mà không ảnh hưởng đến lớp cậu đã cài đặt :D"
    sendResponse(sender_psid, response);
  }, 2000);
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
