const sendResponse = require('../general/sendResponse');

const dbName = 'database-for-cbner';
module.exports = {
  handleMessage: handleMessage,
  handlePostback: handlePostback
}

async function handleMessage(client, sender_psid, textSplit, userData) {
  unblockAll(client, sender_psid);
  let response = {
    "text": ""
  };
  if(textSplit[0] === 'showclass') {
    if(userData.group) {
      response.text = `${userData.group}`;
      sendResponse(sender_psid, response);
    }
    else {
      response.text = "Cậu chưa cài đặt tên lớp :(";
      sendResponse(sender_psid, response);
    }
  }
  else if(textSplit[0] === 'delclass') {
    client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
      $set: {
        group: "",
        main_schedule: []
      }
    }, (err) => {
      if(err) {
        console.error(err);
        response.text = "Ủa không xoá được, cậu hãy thử lại sau nhé T.T";
        sendResponse(sender_psid, response);
      }
      else {
        response.text = "Xoá lớp thành công!"
        sendResponse(sender_psid, response);
      }
    });
  }
  else if(textSplit[0] === 'setclass') {
    if(textSplit.length === 1) {
      response.text = "Tên lớp cậu chưa ghi kìa :(";
      sendResponse(sender_psid, response);
    }
    else if(checkGroup(sender_psid, textSplit[1])) {
      const scheduleData = await client.db(dbName).collection('schedule').findOne({ group: textSplit[1] });
      if(scheduleData) {
        client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
          $set: {
            group: textSplit[1],
            main_schedule: scheduleData.schedule
          }
        }, (err) => {
          if(err) {
            console.error(err);
            response.text = "Ủa không cài đặt được, cậu hãy thử lại sau nhé T.T";
            sendResponse(sender_psid, response);
          }
          else {
            response.text = `Cập nhật thời khoá biểu lớp ${textSplit[1]} thành công!`;
            sendResponse(sender_psid, response);
          }
        });
      }
      else {
        response.text = "Thời khoá biểu lớp cậu chưa được cập nhật do thiếu sót bên kĩ thuật, hãy liên hệ thằng dev qua phần Thông tin và cài đặt nhé!";
        sendResponse(sender_psid, response);
      }
    }
  }
}

function handlePostback(client, sender_psid) {
 const response = {
    "text": `Các lệnh cài đặt tớ hỗ trợ:
- Setclass + tên lớp: cập nhật thời khoá biểu và bỏ qua bước gõ tên lớp khi sử dụng tính năng tra thời khoá biểu
(Ví dụ: setclass 11ti. Đừng lo, khi cậu muốn tra lớp khác, tớ sẽ có một cái button để giúp cậu tra mà không ảnh hưởng đến lớp cậu đã cài đặt).

- Showclass: Xem tên lớp đã cài đặt.

- Delclass: Xoá tên lớp đã cài đặt.`
  };
  sendResponse(sender_psid, response);
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

function unblockAll(client, sender_psid) {
  client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
    $set: {
      search_schedule_block: false,
      search_schedule_other_group: {
        block: false,
        group: "",
        schedule: []
      },
      search_classes: {
        block: false,
        teacher: "",
        teaches: []
      },
      search_subject: {
        block: false,
        subject: "",
        day: "",
        time: ""
      }
    }
  });
}
