const sendResponse = require('../general/sendResponse');
const textResponse = require('../general/textResponse');
const validateInput = require('../general/validate-input');

const dbName = 'database-for-cbner';

module.exports = {
  handleSetGroupMessage: handleSetGroupMessage,
  handleSetTeacherMessage: handleSetTeacherMessage,
  handleWindDownMessage: handleWindDownMessage
}

function handleSetGroupMessage(client, sender_psid, textSplit, userData) {
  let response = textResponse.defaultResponse;
  if(textSplit[0] === 'xemlop') {
    if(userData.group) {
      response = textResponse.xemlopResponse;
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
        group: ""
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
      client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
        $set: {
          group: textSplit[1]
        }
      }, (err) => {
        if(err) {
          response.text = "Ủa không cài đặt được, bạn hãy thử lại sau nhé T.T";
          sendResponse(sender_psid, response);
        }
        else {
          response = textResponse.lopResponse;
          response.text = `Lưu tên lớp thành công! (${textSplit[1]})`;
          sendResponse(sender_psid, response);
        }
      });
    }
  }
}

function handleSetTeacherMessage(client, sender_psid, textSplit, userData) {
  let response = textResponse.defaultResponse;
  if(textSplit[0] === 'xemgv') {
    if(userData.teacher) {
      response = textResponse.xemgvResponse;
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
        teacher: ""
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
      client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
        $set: {
          teacher: textSplit[1],
        }
      }, (err) => {
        if(err) {
          response.text = "Ủa không cài đặt được, bạn hãy thử lại sau nhé T.T";
          sendResponse(sender_psid, response);
        }
        else {
          response = textResponse.gvResponse;
          response.text = `Lưu giáo viên thành công! (${textSplit[1]})`;
          sendResponse(sender_psid, response);
        }
      });
    }
  }
}

function handleWindDownMessage(client, sender_psid, textSplit, userData) {
  let response = textResponse.defaultResponse;
  if(textSplit[0] === 'xemwd') {
    response = textResponse.xemwdResponse;
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
          wind_down_time: Number(textSplit[1])
        }
      }, (err) => {
        if(err) {
          response.text = "Ủa không cài đặt được, bạn hãy thử lại sau nhé T.T";
          sendResponse(sender_psid, response);
        }
        else {
          response = textResponse.wdResponse;
          response.text = `Cài đặt thành công! Thời gian trung bình để chìm vào giấc ngủ của bạn là ${textSplit[1]}'.`;
          sendResponse(sender_psid, response);
        }
      });
    }
  }
}
