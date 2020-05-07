'use strict'
const sendResponse = require('../general/sendResponse');
const stuff = require('../general/stuff');
const { checkGroup } = require('../general/validate-input');
const dbName = 'database-for-cbner';

module.exports = {
  handleMessage: handleMessage,
  init: init
}

function handleMessage(client, sender_psid, text, userData) {
  if(text === "tra lớp khác") {
    const response = stuff.searchScheduleAskGroup;
    clearOtherGroupData(client, sender_psid);
    sendResponse(sender_psid, response);
  }
  else if(!userData.search_schedule_other_group.block) {
    sendSchedule(sender_psid, text, userData);
  }
  else if(userData.search_schedule_other_group.group) {
    sendSchedule(sender_psid, text, userData);
  }
  else if(checkGroup(sender_psid, text)) {
    updateOtherGroupData(client, sender_psid, text);
  }
}

async function init(client, sender_psid, userData) {
  if(userData.group) { // init search_schedule_block
    client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
      $set: {
        search_schedule_block: true
      }
    }, (err) => {
      if(err) {
        console.log("could not init search_schedule_block: " + err);
        const response = {
          "text": "Úi, tớ không kết nối với database được. Bạn hãy thử lại sau nha T.T"
        };
        sendResponse(sender_psid, response);
      }
      else {
        console.log('init search_schedule_block successfully');
        let response = stuff.askDay;
        response.quick_replies[0].title = "Tra lớp khác";
        response.quick_replies[0].payload = "overwriteClass";
        response.text = `Cập nhật thời khoá biểu lớp ${userData.group} thành công!\nBạn muốn tra thứ mấy?`
        sendResponse(sender_psid, response);
      }
    });
  }
  else { // init both search_schedule_block & search_schedule_other_group block
    client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
      $set: {
        search_schedule_block: true,
        search_schedule_other_group: {
          block: true,
          group: "",
          schedule: []
        }
      }
    }, (err) => {
      if(err) {
        console.log("could not init search_schedule_other_group block");
        const response = {
          "text": "Úi, tớ không kết nối với database được. Bạn hãy thử lại sau nha T.T"
        };
        sendResponse(sender_psid, response);
      }
      else {
        console.log('init search_schedule_other_group block successfully');
        const response = stuff.searchScheduleAskGroup;
        sendResponse(sender_psid, response);
      }
    });
  }
}

function clearOtherGroupData(client, sender_psid) {
  client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
    $set: {
      search_schedule_other_group: {
        block: true,
        group: "",
        schedule: []
      }
    }
  }, (err) => {
    if(err) {
      console.log("Could not clear other group data");
      let response = {
        "text": "Úi, tớ không kết nối với database được. Bạn hãy thử lại sau nha T.T"
      };
      sendResponse(sender_psid, response);
    }
    else console.log("clear other group data successfully");
  });
}

function updateOtherGroupData(client, sender_psid, groupInput) {
  client.db(dbName).collection('schedule').findOne({ group: groupInput }, (err, scheduleData) => { // find schedule of groupInput
    if (err) {
      console.error("Could not update other group data: \n" + err);
      const response = {
        "text": "Úi, tớ không kết nối với database được. Bạn hãy thử lại sau nha T.T"
      };
      sendResponse(sender_psid, response);
    }
    else {
      client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
        $set: {
          search_schedule_other_group: {
            block: true,
            group: groupInput,
            schedule: scheduleData.schedule
          }
        }
      }, (err) => {
        if (err) {
          console.error("Could not update other group data: \n" + err);
          const response = {
            "text": "Úi, tớ không kết nối với database được. Bạn hãy thử lại sau nha T.T"
          };
          sendResponse(sender_psid, response);
        } else {
          console.log("Update other group data successfully!");
          let response = stuff.askDay;
          response.quick_replies[0].title = "Tra lớp khác";
          response.quick_replies[0].payload = "overwriteClass";
          response.text = `Cập nhật thời khoá biểu lớp ${groupInput} thành công!\nBạn muốn tra thứ mấy?`;
          sendResponse(sender_psid, response);
        }
      });
    }
  });
}

function sendSchedule(sender_psid, dayInput, userData) {
  let response = stuff.askDay;
  response.quick_replies[0].title = "Tra lớp khác";
  response.quick_replies[0].payload = "overwriteClass";
  let day = handleDayInput(dayInput);
  // Check if we are in search_schedule_other_group block or not, and send the suitable data
  let schedule = (userData.search_schedule_other_group.block)
  ? userData.search_schedule_other_group.schedule
  : userData.main_schedule;
  if(day === "Tất cả") {
    let text = "Lịch học tuần này: ";
    let subText = "";
    schedule.forEach((data) => {
      text += `
Thứ ${data.day}:
 - Sáng: `;
      data.morning.forEach((Class, i) => {
        if(Class.subject !== "")
        subText += `
   + Tiết ${i + 1}: ${Class.subject} - ${Class.teacher}`;
      });
    //    ------------------------
    if(!subText) text += "Nghỉ";
    else text += subText;
    subText = "";
    text += `
 - Chiều: `;
      //
      data.afternoon.forEach((Class, i) => {
        if(Class.subject !== "")
        subText += `
   + Tiết ${i + 1}: ${Class.subject} - ${Class.teacher}`;
      });
      if(!subText) text += "Nghỉ";
      else text += subText;
      subText = "";
      text += `\n-----------`;
    });
    text += "\nHọc tập và làm theo tấm gương đạo đức Hồ Chí Minh!";
    response.text = text;
    sendResponse(sender_psid, response);
  }
  else if(!isNaN(day)){
    if(day == 8) {
      response.text = "Chủ nhật, ai đi học thêm cứ đi, ai muốn tự học cứ học :>";
      sendResponse(sender_psid, response);
    }
    else if(day - 1 > schedule.length || day - 2 < 0) {
      response.text = `Nào, đừng nhắn gì ngoài phần gợi ý bên dưới -_-`;
      sendResponse(sender_psid, response);
    }
    else {
      const data = schedule[day - 2];
      let subText = "";
      let text = `Lịch học thứ ${day}:
 - Sáng: `;
      data.morning.forEach((Class, i) => {
        if(Class.subject !== "")
        subText += `
   + Tiết ${i + 1}: ${Class.subject} - ${Class.teacher}`;
      });
      //    ------------------------
      if(!subText) text += "Nghỉ";
      else text += subText;
      text += `
 - Chiều: `;
      //
      subText = "";
      data.afternoon.forEach((Class, i) => {
        if(Class.subject !== "")
        subText += `
   + Tiết ${i + 1}: ${Class.subject} - ${Class.teacher}`;
      });
      if(!subText) text += "Nghỉ";
      else text += subText;
      text += "\n-----------\nHọc tập và làm theo tấm gương đạo đức Hồ Chí Minh!";
      response.text = text;
      sendResponse(sender_psid, response);
    }
  }
  else {
    response.text = `Nào, đừng nhắn gì ngoài phần gợi ý bên dưới -_-\n`;
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
