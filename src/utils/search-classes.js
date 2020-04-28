'use strict'
const sendResponse = require('../general/sendResponse');
const stuff = require('../general/stuff');
const { checkTeacherName } = require('../general/validate-input');
const dbName = 'database-for-cbner';

module.exports = {
  init: init,
  handleMessage: handleMessage
};

async function handleMessage(client, sender_psid, text, userData) {
  if(text.toLowerCase() === "giáo viên khác") {
    const response = stuff.searchClassesAskTeacher;
    await clearOtherTeacherData(client, sender_psid);
    await sendResponse(sender_psid, response);
  }
  else if(!userData.search_classes_other_teacher.block) {
    sendClasses(sender_psid, text, userData);
  }
  else if(userData.search_classes_other_teacher.teacher) {
    sendClasses(sender_psid, text, userData);
  }
  else if(checkTeacherName(sender_psid, text)) {
    await updateOtherTeacherData(client, sender_psid, text);
  }
}

async function init(client, sender_psid, userData) {
  if(userData.teacher) { // init search_classes_block
    await client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
      $set: {
        search_classes_block: true
      }
    }, (err) => {
      if(err) {
        console.log("could not init search_classes block: " + err);
        const response = {
          "text": "Úi, tớ không kết nối với database được. Bạn hãy thử lại sau nha T.T"
        };
        sendResponse(sender_psid, response);
      }
      else {
        console.log('init search_classes_block successfully');
        let response = stuff.askDay;
        response.quick_replies[0].title = "Giáo viên khác";
        response.quick_replies[0].payload = "overwriteTeacher";
        response.text = `Cập nhật lịch dạy của giáo viên ${userData.teacher} thành công!\nBạn muốn tra thứ mấy?`;
        sendResponse(sender_psid, response);
      }
    });
  }
  else { // init both search_classes_block & search_classes_other_teacher block
    await client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
      $set: {
        search_classes_block: true,
        search_classes_other_teacher: {
          block: true,
          teacher: "",
          teaches: []
        }
      }
    }, (err) => {
      if(err) {
        console.log("could not init search_classes_other_teacher block");
        const response = {
          "text": "Úi, tớ không kết nối với database được. Bạn hãy thử lại sau nha T.T"
        };
        sendResponse(sender_psid, response);
      }
      else {
        console.log('init search search_classes_other_teacher successfully');
        const response = stuff.searchClassesAskTeacher;
        sendResponse(sender_psid, response);
      }
    });
  }
}

async function clearOtherTeacherData(client, sender_psid) {
  await client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
    $set: {
      search_classes_other_teacher: {
        block: true,
        teacher: "",
        teaches: []
      }
    }
  }, (err) => {
    if(err) {
      console.log("Could not clear teacher-data: " + err);
      const response = {
        "text": "Úi, tớ không kết nối với database được. Bạn hãy thử lại sau nha T.T"
      };
      sendResponse(sender_psid, response);
    }
    else console.log("Clear other_teacher data successfully");
  });
}

async function updateOtherTeacherData(client, sender_psid, teacherName) {
  await client.db(dbName).collection('schedule').find({
    $or: [
      { "schedule.morning.teacher": teacherName },
      { "schedule.afternoon.teacher": teacherName }
    ]
  }).toArray(async (err, docs) => {
    if(err) console.log("Cound not find any teach data");
    else if(docs) {
      let teaches = [];
      for(let i = 0; i < 6; i ++) { // loop days
        teaches.push({
          "morning": [],
          "afternoon": []
        });
        if(teacherName === "LV.Ngân" || teacherName === "HT.Nhân")
          if(i === 0) teaches[i].afternoon.push({
            class: 1,
            group: '11t'
          })
        for(let j = 0; j < 5; j ++) { // loop classes
          // loop groups
          docs.forEach((doc) => {
            if(doc.schedule[i].morning[j] && doc.schedule[i].morning[j].teacher === teacherName){
              teaches[i].morning.push({
                class: j + 1,
                group: doc.group
              });
              return; // If found, immediately return cause teacher teaches one class per group
            }
          });
          docs.forEach((doc) => {
            if(doc.schedule[i].afternoon[j] && doc.schedule[i].afternoon[j].teacher === teacherName){
              teaches[i].afternoon.push({
                class: j + 1,
                group: doc.group
              });
              return;
            }
          });
        }
      }
      console.log(teaches);
      await client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
        $set: {
          search_classes_other_teacher: {
            block: true,
            teacher: teacherName,
            teaches: teaches
          }
        }
      }, (err) => {
        if (err) {
          console.log("Could not update teacher data: " + err);
          const response = {
            "text": "Úi, tớ không kết nối với database được. Bạn hãy thử lại sau nha T.T"
          };
          sendResponse(sender_psid, response);
        } else {
          console.log("Update teacher data successfully");
          let response = stuff.askDay;
          response.quick_replies[0].title = "Giáo viên khác";
          response.quick_replies[0].payload = "overwriteTeacher";
          response.text = `Cập nhật lịch dạy của giáo viên ${teacherName} thành công!\nBạn muốn tra thứ mấy?`;
          sendResponse(sender_psid, response);
        }
      });
    }
    else {
      response = stuff.checkTeacherNameResponse;
      response.text = `Tuần này giáo viên ${teacherName} không có buổi dạy nào :(`;
      sendResponse(sender_psid, response);
    }
  });
}

function sendClasses(sender_psid, dayInput, userData) {
  let response = stuff.askDay;
  response.quick_replies[0].title = "Giáo viên khác";
  response.quick_replies[0].payload = "overwriteTeacher";
  let day = handleDayInput(dayInput.toLowerCase());
  // Check if we are in search_schedule_other_group block or not, and send the suitable data
  let teaches = userData.search_classes_other_teacher.block
  ? userData.search_classes_other_teacher.teaches
  : userData.main_teach_schedule;
  if(day === "Tất cả") {
    let text = `Lịch dạy tuần này: `;
    teaches.forEach((data, days) => {
      text += `
Thứ ${days + 2}:
 - Sáng: `;
      if(data.morning.length === 0) text += "Trống";
      else {
        data.morning.forEach((subdata) => {
          text += `
   + Tiết ${subdata.class}: ${subdata.group}`;
        });
      }
      //    ------------------------
      text += `
 - Chiều: `;
      //
      if(data.afternoon.length === 0) text += "Trống";
      else {
        data.afternoon.forEach((subdata) => {
          text += `
   + Tiết ${subdata.class}: ${subdata.group}`;
        });
      }
      //    ------------------------
      text += `\n-----------`;
    });
    text += `\nVì Tổ quốc xã hội chủ nghĩa. Vì lý tưởng của Bác Hồ vĩ đại: Sẵn sàng!`;
    response.text = text;
    sendResponse(sender_psid, response);
  }
  else if(!isNaN(day)){
    if(day == 8) {
      response.text = "Chủ nhật thì ai chẳng ở nhà bận yêu gia đình :3";
      sendResponse(sender_psid, response);
    }
    else if(day - 1 > teaches.length || day - 2 < 0) {
      response.text = `Nào, đừng nhắn gì ngoài phần gợi ý bên dưới -_-`;
      sendResponse(sender_psid, response);
    }
    else {
      const data = teaches[day - 2];
      let text = `Lịch dạy thứ ${day}:
 - Sáng: `;
      if(data.morning.length === 0) text += "Trống";
      else {
        data.morning.forEach((subdata) => {
          text += `
   + Tiết ${subdata.class}: ${subdata.group}`;
        });
      }
      //    ------------------------
      text += `
 - Chiều: `;
      //
      if(data.afternoon.length === 0) text += "Trống";
      else {
        data.afternoon.forEach((subdata) => {
          text += `
   + Tiết ${subdata.class}: ${subdata.group}`;
        });
      }
      text += `\n-----------\nVì Tổ quốc xã hội chủ nghĩa. Vì lý tưởng của Bác Hồ vĩ đại: Sẵn sàng!`;
      response.text = text;
      sendResponse(sender_psid, response);
    }
  }
  else {
    response.text = `Nào, đừng nhắn gì ngoài phần gợi ý bên dưới -_-`;
    sendResponse(sender_psid, response);
  }
}

function handleDayInput(day) {
  const date = new Date();
  date.setHours(date.getHours() + 7); // App is deployed in heroku US
  let dayNow = Number(date.getDay()) + 1;
  switch (day) {
    case 'tất cả':
      return 'Tất cả';
      break;
    case 'hôm nay':
      if(dayNow === 1) return 8;
      return dayNow;
      break;
    case 'hôm qua':
      if(dayNow === 2) return 8;
      if(dayNow === 1) return 7;
      dayNow --;
      return dayNow;
      break;
    case 'ngày mai':
      dayNow ++;
      return dayNow;
      break;
    case 'chủ nhật':
      return 8;
      break;
    default:
      return day;
  }
}
