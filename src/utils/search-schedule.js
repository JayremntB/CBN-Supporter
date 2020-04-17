'use strict'
const sendResponse = require('../common/sendResponse');
const stuff = require('../common/stuff');
 
const dbName = 'database-for-cbner';
let response = {
  "text": "Úi, tớ không kết nối với database được. Cậu hãy thử lại sau nha T.T"
};

function initData(client, sender_psid) {
  const collectionUsersSearchSchedule = client.db(dbName).collection('users-search-schedule');
  collectionUsersSearchSchedule.insertOne({ sender_psid: sender_psid }, (err) => {
    if(err) {
      console.error(err);
      sendResponse(sender_psid, response);
    }
    else console.log("insert data successfullly");
  });
}

function deleteData(client, sender_psid) {
  const collectionUsersSearchSchedule = client.db(dbName).collection('users-search-schedule');
  collectionUsersSearchSchedule.deleteOne({ sender_psid: sender_psid }, (err, res) => {
    if(err) {
      console.error(err);
      sendResponse(sender_psid, response);
    }
    else console.log("delete data successfullly");
  });
}

async function getData(client, sender_psid) {
  const collectionUsersSearchSchedule = client.db(dbName).collection('users-search-schedule');
  return collectionUsersSearchSchedule.findOne({ sender_psid: sender_psid });
}

function clearGroupAndSchedule(client, sender_psid) {
  const collectionUsersSearchSchedule = client.db(dbName).collection('users-search-schedule');
  collectionUsersSearchSchedule.updateOne({ sender_psid: sender_psid }, {
    $unset: {
      group: "",
      schedule: ""
    }
  }, (err) => {
    if(err) {
      console.log("Could not clear group and schedule data");
      sendResponse(sender_psid, response);
    } else {
      console.log("clear group and schedule successfully");
    }
  });
}
async function updateData(client, sender_psid, groupInput) {
  const collectionSchedule = client.db(dbName).collection('schedule');
  const data = await collectionSchedule.findOne({ group: groupInput });
  if(data) {
    console.log("Found data");
    // add schedule to user-search data
    const collectionUsersSearchSchedule = client.db(dbName).collection('users-search-schedule');
    const update = {
      group: groupInput,
      schedule: data.schedule
    }
    collectionUsersSearchSchedule.updateOne({ sender_psid: sender_psid }, {
      $set: update
    }, (err, res) => {
      let response;
      if (err) {
        console.error("Could not update data: \n" + err);
        response = {
          "text": "Hmm, tớ không cập nhật được thời khoá biểu vào database, cậu hãy thử lại sau nhé :("
        };
        sendResponse(sender_psid, response);
      } else {
        console.log("Update successfully!");
        response = stuff.searchScheduleAskDay;
        response.text = `Cập nhật thời khoá biểu lớp ${groupInput} thành công!\nCậu muốn tra thứ mấy?`;
        sendResponse(sender_psid, response);
      }
    });
  }
}

function sendSchedule(sender_psid, dayInput, Data) {
  let response = stuff.searchScheduleAskDay;
  let day = handleDayInput(dayInput);
  // Find document with those selections
  if(day === "Tất cả") {
    let text = "Lịch học tuần này của cậu đây: ";
    Data.schedule.forEach((data) => {
      console.log(data);
      text += `
* Thứ ${data.day}:
 - Sáng: `
      if(data.time.morning.length === 0) text += "Nghỉ";
      else {
        data.time.morning.forEach((Class, i) => {
          text += `
   + Tiết ${i + 1}: ${Class.subject} - ${Class.teacher}`
        });
      }
      //    ------------------------
      text += `
 - Chiều: `
      //
      if(data.time.afternoon.length === 0) text += "Nghỉ";
      else {
        data.time.afternoon.forEach((Class, i) => {
          text += `
   + Tiết ${i + 1}: ${Class.subject} - ${Class.teacher}`
        });
      }
    });
    text += "\nHọc tập và làm theo tấm gương đạo đức Hồ Chí Minh!"
    response.text = text;
    sendResponse(sender_psid, response);
  }
  else if(!isNaN(day)){
    if(day == 8) {
      response.text = "Chủ nhật học hành cái gì hả đồ chăm học -_-";
      sendResponse(sender_psid, response);
    } else if(day - 1 > Data.schedule.length || day - 2 < 0) {
      response.text = `Lại điền vớ vẩn đúng không :( Tôi đây biết hết nhá :< Đừng có ghi gì ngoài mấy cái gợi ý -_-`
      sendResponse(sender_psid, response);
    } else {
      const data = Data.schedule[day - 2];
      let text = `Lịch học thứ ${day}:
 - Sáng: `;
      if(data.time.morning.length === 0) text += "Nghỉ";
      else {
        data.time.morning.forEach((Class, i) => {
          text += `
   + Tiết ${i + 1}: ${Class.subject} - ${Class.teacher}`
        });
      }
      //    ------------------------
      text += `
 - Chiều: `
      //
      if(data.time.afternoon.length === 0) text += "Nghỉ";
      else {
        data.time.afternoon.forEach((Class, i) => {
          text += `
   + Tiết ${i + 1}: ${Class.subject} - ${Class.teacher}`
        });
      }
      text += "\nHọc tập và làm theo tấm gương đạo đức Hồ Chí Minh!"
      response.text = text;
      sendResponse(sender_psid, response);
    }
  } else {
    response.text = `Lại điền vớ vẩn đúng không :( Tôi đây biết hết nhá :< Đừng có ghi gì ngoài mấy cái gợi ý -_-`
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

module.exports = {
  initData: initData,
  getData: getData,
  clearGroupAndSchedule: clearGroupAndSchedule,
  updateData: updateData,
  sendSchedule: sendSchedule,
  deleteData: deleteData
}
