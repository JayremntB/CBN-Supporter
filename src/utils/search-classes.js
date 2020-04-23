const sendResponse = require('../general/sendResponse');

module.exports = {
  init: init,
  handleMessage: handleMessage
};

function init(client, sender_psid, userData) {
  let response = {
    "text": "Úi, tớ không kết nối với database được. Cậu hãy thử lại sau nha T.T"
  };
  createBlock(client, sender_psid);
  response = stuff.searchClassesAskTeacher;
  sendResponse(sender_psid, response);
}

function handleMessage(client, sender_psid, text, userData) {
  if(text.toLowerCase() === "giáo viên khác") {
    const response = stuff.searchScheduleAskGroup;
    clearData(client, sender_psid);
    sendResponse(sender_psid, response);
  }
  else if(userData.search_classes.teacher) {
    sendClasses(sender_psid, text, userData);
  }
  else {
    updateData(client, sender_psid, text);
  }
}

function createBlock(client, sender_psid) {
  const collectionUserData = client.db(dbName).collection('users-data');
  let response = {
    "text": "Úi, tớ không kết nối với database được. Cậu hãy thử lại sau nha T.T"
  };
  collectionUserData.updateOne({ sender_psid: sender_psid }, {
    $set: {
      search_classes: {
        block: true,
        teacher: "",
        teaches: []
      }
    }
  }, (err) => {
    if(err) {
      console.error(err);
      sendResponse(sender_psid, response);
    }
    else console.log('init search block successfully');
  });
}

function updateData(client, sender_psid, teacherName) {
  let response = {
    "text": ""
  }
  client.db(dbName).collection('schedule').find({
    $or: [
      {"schedule.morning.teacher": teacherName},
      {"schedule.afternoon.teacher": teacherName}
    ]
  }).toArray((err, docs) => {
    if(err) console.log(err);
    else if(docs) {
      let teaches = [];
      for(let i = 0; i < 6; i ++) { // loop days
        teaches.push({
          "morning": [],
          "afternoon": []
        });
        for(let j = 0; j < 5; j ++) { // loop classes
          // loop groups
          docs.forEach((doc) => {
            if(doc.schedule[i].morning[j] && doc.schedule[i].morning[j].teacher === teacherName){
              teaches[i].morning.push(doc.group);
              return; // If found, immediately return cause teacher teaches one class per group
            }
          });
          docs.forEach((doc) => {
            if(doc.schedule[i].afternoon[j] && doc.schedule[i].afternoon[j].teacher === teacherName){
              teaches[i].afternoon.push(doc.group);
              return;
            }
          });
        }
      }
      client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
        $set: {
          search_classes: {
            block: true,
            teacher: teacherName,
            teaches: teaches
          }
        }
      }, (err) => {
        if (err) {
          const response = {
            "text": "Úi, tớ không kết nối với database được. Cậu hãy thử lại sau nha T.T"
          };
          console.error("Could not update teaches data: \n" + err);
          sendResponse(sender_psid, response);
        } else {
          console.log("Update teaches data successfully!");
          let response = stuff.askDay;
          response.quick_replies[0].title = "Giáo viên khác";
          response.quick_replies[0].payload = "overwriteTeacher";
          response.text = `Cập nhật lịch dạy của giáo viên ${teacherName} thành công!\nCậu muốn tìm lịch dạy vào thứ mấy?`;
          sendResponse(sender_psid, response);
        }
      });
    }
    else {
      response = stuff.checkTeacherNameResponse;
    }
  });
}
