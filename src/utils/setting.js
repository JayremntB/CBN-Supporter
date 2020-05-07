const sendResponse = require('../general/sendResponse');
const stuff = require('../general/stuff');
const validateInput = require('../general/validate-input');

const dbName = 'database-for-cbner';

module.exports = {
  handleSetGroupMessage: handleSetGroupMessage,
  handleSetTeacherMessage: handleSetTeacherMessage,
  handleWindDownMessage: handleWindDownMessage
}

function handleSetGroupMessage(client, sender_psid, textSplit, userData) {
  let response = stuff.defaultResponse;
  if(textSplit[0] === 'xemlop') {
    if(userData.group) {
      response = stuff.xemlopResponse;
      response.text = `${userData.group}`;
      sendResponse(sender_psid, response);
    }
    else {
      response.text = "Bạn chưa cài đặt tên lớp :(";
      sendResponse(sender_psid, response);
    }
  }
  else if(textSplit[0] === 'xoalop') {
    client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
      $set: {
        group: "",
        main_schedule: []
      }
    }, (err) => {
      if(err) {
        response.text = "Ủa không xoá được, bạn hãy thử lại sau nhé T.T";
        sendResponse(sender_psid, response);
      }
      else {
        response.text = "Xoá lớp thành công!"
        sendResponse(sender_psid, response);
      }
    });
  }
  else if(textSplit[0] === 'lop') {
    if(textSplit.length === 1) {
      response.text = "Tên lớp bạn chưa ghi kìa :(";
      sendResponse(sender_psid, response);
    }
    else if(validateInput.checkGroup(sender_psid, textSplit[1])) {
      client.db(dbName).collection('schedule').findOne({ group: textSplit[1] }, (err, scheduleData) => {
        if (err) {
          const response = {
            "text": "Úi, tớ không kết nối với database được. Bạn hãy thử lại sau nha T.T"
          };
          sendResponse(sender_psid, response);
        }
        else if(scheduleData) {
          client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
            $set: {
              group: textSplit[1],
              main_schedule: scheduleData.schedule
            }
          }, (err) => {
            if(err) {
              response.text = "Ủa không cài đặt được, bạn hãy thử lại sau nhé T.T";
              sendResponse(sender_psid, response);
            }
            else {
              response = stuff.lopResponse;
              response.text = `Cập nhật thời khoá biểu lớp ${textSplit[1]} thành công!`;
              sendResponse(sender_psid, response);
            }
          });
        }
        else {
          response.text = "Thời khoá biểu lớp bạn chưa được cập nhật do thiếu sót bên kĩ thuật, hãy liên hệ thằng dev qua phần Thông tin và cài đặt nhé!";
          sendResponse(sender_psid, response);
        }
      });
    }
  }
}

function handleSetTeacherMessage(client, sender_psid, textSplit, userData) {
  let response = stuff.defaultResponse;
  if(textSplit[0] === 'xemgv') {
    if(userData.teacher) {
      response = stuff.xemgvResponse;
      response.text = `${userData.teacher}`;
      sendResponse(sender_psid, response);
    }
    else {
      response.text = "Bạn chưa cài đặt tên giáo viên :(";
      sendResponse(sender_psid, response);
    }
  }
  else if(textSplit[0] === 'xoagv') {
    client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
      $set: {
        teacher: "",
        main_teach_schedule: []
      }
    }, (err) => {
      if(err) {
        response.text = "Ủa không xoá được, bạn hãy thử lại sau nhé T.T";
        sendResponse(sender_psid, response);
      }
      else {
        response.text = "Xoá lịch dạy thành công!"
        sendResponse(sender_psid, response);
      }
    });
  }
  else if(textSplit[0] === 'gv') {
    if(textSplit.length === 1) {
      response.text = "Tên giáo viên bạn chưa ghi kìa :(";
      sendResponse(sender_psid, response);
    }
    else if(validateInput.checkTeacherName(sender_psid, textSplit[1])) {
      client.db(dbName).collection('schedule').find({
        $or: [
          { "schedule.morning.teacher": textSplit[1] },
          { "schedule.afternoon.teacher": textSplit[1] }
        ]
      }).toArray((err, docs) => {
        if (err) {
          console.log(err);
          const response = {
            "text": "Úi, tớ không kết nối với database được. Bạn hãy thử lại sau nha T.T"
          };
          sendResponse(sender_psid, response);
        }
        else if(docs) {
          let teaches = [];
          for(let i = 0; i < 6; i ++) { // loop days
            teaches.push({
              "morning": [],
              "afternoon": []
            });
            if(textSplit[1] === "LV.Ngân" || textSplit[1] === "HT.Nhân")
              if(i === 0) teaches[i].afternoon.push({
                class: 1,
                group: '11t'
              })
            for(let j = 0; j < 5; j ++) { // loop classes
              // loop groups
              docs.forEach((doc) => {
                if(doc.schedule[i].morning[j] && doc.schedule[i].morning[j].teacher === textSplit[1]){
                  teaches[i].morning.push({
                    class: j + 1,
                    group: doc.group
                  });
                  return; // If found, immediately return cause teacher teaches one class per group
                }
              });
              docs.forEach((doc) => {
                if(doc.schedule[i].afternoon[j] && doc.schedule[i].afternoon[j].teacher === textSplit[1]){
                  teaches[i].afternoon.push({
                    class: j + 1,
                    group: doc.group
                  });
                  return;
                }
              });
            }
          }
          client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
            $set: {
              teacher: textSplit[1],
              main_teach_schedule: teaches
            }
          }, (err) => {
            if(err) {
              response.text = "Ủa không cài đặt được, bạn hãy thử lại sau nhé T.T";
              sendResponse(sender_psid, response);
            }
            else {
              response = stuff.gvResponse;
              response.text = `Cập nhật lịch dạy giáo viên ${textSplit[1]} thành công!`;
              sendResponse(sender_psid, response);
            }
          });
        }
      });
    }
  }
}

function handleWindDownMessage(client, sender_psid, textSplit, userData) {
  let response = stuff.defaultResponse;
  if(textSplit[0] === 'xemwd') {
    response = stuff.xemwdResponse;
    response.text = `${userData.wind_down_time}'`;
    sendResponse(sender_psid, response);
  }
  else if(textSplit[0] === 'xoawd') {
    client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
      $set: {
        wind_down_time: 14
      }
    }, (err) => {
      if(err) {
        response.text = "Ủa không xoá được, bạn hãy thử lại sau nhé T.T";
        sendResponse(sender_psid, response);
      }
      else {
        response.text = "Thời gian trung bình để chìm vào giấc ngủ của bạn đã được đổi về mặc định (14')"
        sendResponse(sender_psid, response);
      }
    });
  }
  else if(textSplit[0] === 'wd') {
    if(textSplit.length === 1) {
      response.text = "Bạn chưa ghi thời gian kìa :(";
      sendResponse(sender_psid, response);
    }
    else if(validateInput.checkWindDownTime(sender_psid, textSplit[1])) {
      client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
        $set: {
          wind_down_time: textSplit[1]
        }
      }, (err) => {
        if(err) {
          response.text = "Ủa không cài đặt được, bạn hãy thử lại sau nhé T.T";
          sendResponse(sender_psid, response);
        }
        else {
          response = stuff.wdResponse;
          response.text = `Cài đặt thành công! Thời gian trung bình để chìm vào giấc ngủ của bạn là ${textSplit[1]}'.`;
          sendResponse(sender_psid, response);
        }
      });
    }
  }
}
