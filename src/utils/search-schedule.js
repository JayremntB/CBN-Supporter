'use strict'
const sendResponse = require('../general/sendResponse');
const stuff = require('../general/stuff');

const dbName = 'database-for-cbner';
module.exports = {
  handleMessage: handleMessage,
  handlePostback: handlePostback
}

function handleMessage(client, sender_psid, text, userData) {
  if(text === "lớp khác") {
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

function handlePostback(client, sender_psid) {
  let response = {
    "text": "Úi, tớ không kết nối với database được. Cậu hãy thử lại sau nha T.T"
  };
  client.db(dbName).collection('users-data').findOne({ sender_psid: sender_psid }, (err, userData) => {
    if(err) {
      console.error(err);
      sendResponse(sender_psid, response);
    }
    else if(userData.group) {
      initBlock(client, sender_psid, false); // init search_schedule_block
      response = stuff.searchScheduleAskDay;
      response.text = `Cập nhật thời khoá biểu lớp ${userData.group} thành công!\nCậu muốn tra thứ mấy?`
      sendResponse(sender_psid, response);
    }
    else {
      initBlock(client, sender_psid, true); // init both search_schedule_block & search_schedule_other_group block
      response = stuff.searchScheduleAskGroup;
      sendResponse(sender_psid, response);
    }
  });
}

function initBlock(client, sender_psid, otherGroup) {
  const collectionUserData = client.db(dbName).collection('users-data');
  let response = {
    "text": "Úi, tớ không kết nối với database được. Cậu hãy thử lại sau nha T.T"
  };
  if(!otherGroup) {
    collectionUserData.updateOne({ sender_psid: sender_psid }, {
      $set: {
        search_schedule_block: true
      }
    }, (err) => {
      if(err) {
        console.error(err);
        sendResponse(sender_psid, response);
      }
      else console.log('init search block successfully');
    });
  }
  else {
    collectionUserData.updateOne({ sender_psid: sender_psid }, {
      $set: {
        search_schedule_block: true,
        search_schedule_other_group: {
          block: true
        }
      }
    }, (err) => {
      if(err) {
        console.error(err);
        sendResponse(sender_psid, response);
      }
      else console.log('init search other group successfully');
    });
  }
}

function checkGroup(sender_psid, group) {
  const checkArray = ['10t1', '10t2', '10l', '10h', '10si', '10ti', '10v1', '10v2', '10su', '10đ','10a1', '10a2', '11t', '11l', '11h', '11si', '11ti', '11v', '11su', '11đ','11c1','11c2', '11a1', '11a2', '12t', '12l', '12h', '12si', '12ti', '12v', '12su', '12đ', '12c1', '12c2', '12a1', '12a2'];
  if(checkArray.includes(group)) return true;
  else {
    const response = stuff.searchScheduleCheckGroupResponse;
    sendResponse(sender_psid, response);
    return false;
  }
}

function clearOtherGroupData(client, sender_psid) {
  client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
    $set: {
      search_schedule_other_group: {
        group: "",
        schedule: [],
        block: true
      }
    }
  }, (err) => {
    if(err) {
      let response = {
        "text": "Úi, tớ không kết nối với database được. Cậu hãy thử lại sau nha T.T"
      };
      console.log("Could not clear other group data");
      sendResponse(sender_psid, response);
    } else {
      console.log("clear other group data successfully");
    }
  });
}

async function updateOtherGroupData(client, sender_psid, groupInput) {
  const scheduleData = await client.db(dbName).collection('schedule').findOne({ group: groupInput }); // find schedule of groupInput
  if(scheduleData) {
    console.log("Found data");
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
        const response = {
          "text": "Úi, tớ không kết nối với database được. Cậu hãy thử lại sau nha T.T"
        };
        console.error("Could not update other group data: \n" + err);
        sendResponse(sender_psid, response);
      } else {
        console.log("Update other group data successfully!");
        let response = stuff.searchScheduleAskDay;
        response.text = `Cập nhật thời khoá biểu lớp ${groupInput} thành công!\nCậu muốn tra thứ mấy?`;
        sendResponse(sender_psid, response);
      }
    });
  }
  else {
    let response = {
      "text": "Thời khoá biểu lớp cậu chưa được cập nhật do thiếu sót bên kĩ thuật, hãy liên hệ thằng dev qua phần Thông tin và cài đặt nhé!"
    };
    sendResponse(sender_psid, response);
  }
}

function sendSchedule(sender_psid, dayInput, userData) {
  let response = stuff.searchScheduleAskDay;
  let day = handleDayInput(dayInput);
  // Check if we are in search_schedule_other_group block or not, and send the suitable data
  let schedule = (userData.search_schedule_other_group.block)
  ? userData.search_schedule_other_group.schedule
  : userData.main_schedule;
  if(day === "Tất cả") {
    let text = "Lịch học tuần này của cậu đây: ";
    schedule.forEach((data) => {
      console.log(data);
      text += `
* Thứ ${data.day}:
 - Sáng: `
      if(data.morning.length === 0) text += "Nghỉ";
      else {
        data.morning.forEach((Class, i) => {
          text += `
   + Tiết ${i + 1}: ${Class.subject} - ${Class.teacher}`
        });
      }
      //    ------------------------
      text += `
 - Chiều: `
      //
      if(data.afternoon.length === 0) text += "Nghỉ";
      else {
        data.afternoon.forEach((Class, i) => {
          text += `
   + Tiết ${i + 1}: ${Class.subject} - ${Class.teacher}`
        });
      }
      text += `\n-----------`;
    });
    text += "\nHọc tập và làm theo tấm gương đạo đức Hồ Chí Minh!"
    response.text = text;
    sendResponse(sender_psid, response);
  }
  else if(!isNaN(day)){
    if(day == 8) {
      response.text = "Chủ nhật học hành cái gì hả đồ chăm học -_-";
      sendResponse(sender_psid, response);
    }
    else if(day - 1 > schedule.length || day - 2 < 0) {
      response.text = `Lại điền vớ vẩn đúng không :( Tôi đây biết hết nhá -_-\nĐừng viết gì ngoài mấy cái hiện lên bên dưới -_-`;
      sendResponse(sender_psid, response);
    } else {
      const data = schedule[day - 2];
      let text = `Lịch học thứ ${day}:
 - Sáng: `;
      if(data.morning.length === 0) text += "Nghỉ";
      else {
        data.morning.forEach((Class, i) => {
          text += `
   + Tiết ${i + 1}: ${Class.subject} - ${Class.teacher}`
        });
      }
      //    ------------------------
      text += `
 - Chiều: `
      //
      if(data.afternoon.length === 0) text += "Nghỉ";
      else {
        data.afternoon.forEach((Class, i) => {
          text += `
   + Tiết ${i + 1}: ${Class.subject} - ${Class.teacher}`
        });
      }
      text += "\n-----------\nHọc tập và làm theo tấm gương đạo đức Hồ Chí Minh!"
      response.text = text;
      sendResponse(sender_psid, response);
    }
  }
  else {
    response.text = `Lại điền vớ vẩn đúng không :( Tôi đây biết hết nhá -_-\nĐừng viết gì ngoài mấy cái hiện lên bên dưới -_-`;
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
