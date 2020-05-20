const sendResponse = require('./sendResponse');
const textResponse = require('./textResponse');

module.exports = {
  checkTeacherName: checkTeacherName,
  checkGroup: checkGroup,
  checkWindDownTime: checkWindDownTime,
  handleDayInput: handleDayInput,
  extractHostname: extractHostname
}

function checkTeacherName(sender_psid, teacherName) {
  const checkArray = textResponse.teachersCheckArray;
  if(checkArray.includes(teacherName)) return true;
  else {
    let response = textResponse.checkTeacherNameResponse;
    response.text = "Tên giáo viên không có trong danh sách hoặc không có tiết dạy nào. Kiểm tra lại xem bạn có viết nhầm hay không nhé.\nNhầm thì viết lại luôn nha :>";
    sendResponse(sender_psid, response);
    return false;
  }
}

function checkGroup(sender_psid, group) {
  const checkArray = textResponse.groupsCheckArray;
  if(checkArray.includes(group)) return true;
  else {
    let response = textResponse.checkGroupResponse;
    response.text = "Tên lớp không có trong danh sách. Kiểm tra lại xem bạn có viết nhầm hay không nhé.\nNhầm thì viết lại luôn nha :>"
    sendResponse(sender_psid, response);
    return false;
  }
}

function checkWindDownTime(sender_psid, time) {
  if(isNaN(time) || time < 0) {
    let response = textResponse.defaultResponse;
    response.text = "Xin lỗi, tớ không hiểu thời gian bạn vừa nhập :(";
    sendResponse(sender_psid, response);
    return 0;
  }
  if(time >= 8 * 60) {
    let response = textResponse.defaultResponse;
    response.text = "Thế thì thức luôn đi chứ còn ngủ gì nữa @@";
    sendResponse(sender_psid, response);
    return 0;
  }
  return 1;
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

function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname
    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }
    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}
