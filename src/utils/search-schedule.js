'use strict'
const sendResponse = require('../general/sendResponse');
const textResponse = require('../general/textResponse');
const { checkGroup, handleDayInput } = require('../general/validate-input');
const dbName = 'database-for-cbner';

module.exports = {
  handleMessage: handleMessage,
  init: init
}

function handleMessage(client, sender_psid, text, userData) {
  if(text === "tra lớp khác") {
    const response = textResponse.searchScheduleAskGroup;
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
    updateData(client, sender_psid, text, userData.search_schedule_other_group.block);
  }
}

function init(client, sender_psid, userData) {
  if(userData.group) { // init search_schedule_block, add schedule of that group
    updateData(client, sender_psid, userData.group, userData.search_schedule_other_group.block);
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
        const response = textResponse.searchScheduleAskGroup;
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

function updateData(client, sender_psid, groupInput, other_group_block) {
  client.db(dbName).collection('schedule').findOne({ group: groupInput }, (err, scheduleData) => { // find schedule of groupInput
    if (err) {
      console.error("Could not update other group data: \n" + err);
      const response = {
        "text": "Úi, tớ không kết nối với database được. Bạn hãy thử lại sau nha T.T"
      };
      sendResponse(sender_psid, response);
    }
    else {
      let update;
      if(other_group_block) {
        update = {
          search_schedule_block: true,
          search_schedule_other_group: {
            block: true,
            group: groupInput,
            schedule: scheduleData.schedule
          }
        };
      }
      else {
        update = {
          search_schedule_block: true,
          main_schedule: scheduleData.schedule
        };
      }
      client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
        $set: update
      }, (err) => {
        if (err) {
          console.error("Could not update other group data: \n" + err);
          const response = {
            "text": "Úi, tớ không kết nối với database được. Bạn hãy thử lại sau nha T.T"
          };
          sendResponse(sender_psid, response);
        } else {
          console.log("Update other group data successfully!");
          let response = textResponse.askDay;
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
  let response = textResponse.askDay;
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
      response.text = "Chủ nhật mà vẫn muốn tìm thời khoá biểu để học ư 🥺";
      sendResponse(sender_psid, response);
    }
    else if(day - 1 > schedule.length || day - 2 < 0) {
      response.text = `Nào, đừng nhắn gì ngoài phần gợi ý bên dưới 🥺\nBạn có thể nhập Exit để sử dụng các tính năng khác...`;
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
    response.text = `Nào, đừng nhắn gì ngoài phần gợi ý bên dưới 🥺\nBạn có thể nhập Exit để sử dụng các tính năng khác...`;
    sendResponse(sender_psid, response);
  }
}
