const sendResponse = require('./sendResponse');
const textResponse = require('./textResponse');
const { groupsCheckArray, teachersCheckArray } = require('./template');

module.exports = {
  checkTeacherName: checkTeacherName,
  checkGroup: checkGroup,
  checkSubjectName: checkSubjectName,
  checkWindDownTime: checkWindDownTime,
  handleDayInput: handleDayInput,
  handleTeacherName: handleTeacherName,
  extractExtName: extractExtName,
  extractHostname: extractHostname,
  filterWordSimsimi: filterWordSimsimi
}

function filterWordSimsimi(text) {
  const filterWords = ["Địt", "địt", "Lồn", "lồn", "Cặc", "cặc", "Cu", "cu", "liếm", "bú", "đái", "chym", "Buồi", "buồi"];
  let textSplit = text.split(" ");
  let fullText = "";
  let filterWordsCount = 0;
  textSplit.forEach((textPart, i) => {
    console.log(textPart);
    filterWords.forEach((word) => {
      if(textPart.includes(word)) {
        textSplit[i] = "***";
        filterWordsCount ++;
        return;
      }
    });
  });
  textSplit.forEach(textPart => {
    fullText += textPart + " ";
  });
  const textReturn = filterWordsCount >= 4 ? "*Sim vừa bị Jay vả vì định nói quá nhiều từ bậy*" : fullText;
  return textReturn;
}

function checkSubjectName(sender_psid, subjectName) {
  const checkArray = ["toán", "vật lý", "hoá học", "sinh học", "tin học", "ngữ văn", "ngoại ngữ", "lịch sử", "địa lý", "gdcd", "thể dục"];
  if(checkArray.includes(subjectName)) return true;
  else {
    response = {
      "text": "Tên môn học không hợp lệ. Kiểm tra lại xem bạn có viết nhầm hay không nhé.\nNhầm thì viết lại luôn nha :>"
    };
    sendResponse(sender_psid, response);
    return false;
  }
}

function handleTeacherName(teacherName) {
  let teacherNameToSearch = "";
  teacherNameSeparateByDot = teacherName.split(".");
  if(teacherNameSeparateByDot.length === 1) {
    teacherNameSeparateBySlash = teacherNameSeparateByDot[0].split("/");
    teacherNameSeparateBySlash.forEach((perTeacher, i) => {
      teacherNameToSearch += perTeacher.charAt(0).toUpperCase() + perTeacher.slice(1).toLowerCase();
      if(i !== teacherNameSeparateBySlash.length - 1) teacherNameToSearch += "/";
    });
  }
  else teacherNameToSearch = teacherNameSeparateByDot[0].toUpperCase() + "." + teacherNameSeparateByDot[1].charAt(0).toUpperCase() + teacherNameSeparateByDot[1].slice(1).toLowerCase();
  console.log(teacherNameToSearch);
  return teacherNameToSearch;
}

function checkTeacherName(sender_psid, teacherName) {
  console.log(teacherName);
  const checkArray = teachersCheckArray;
  if(checkArray.includes(teacherName)) return true;
  else {
    // recommend teachers
    let listRecommendedTeachers = [];
    checkArray.forEach(teacher => {
      teacherNameSplit = teacherName.split('.');
      if(teacher.includes(teacherNameSplit[teacherNameSplit.length - 1])) {
        listRecommendedTeachers.push(teacher);
      }
    });
    // announce
    let response = {
      "text": ""
    }
    if(listRecommendedTeachers.length === 0) {
      response.text = "Không có kết quả đề xuất giáo viên nào. Kiểm tra xem bạn có viết nhầm ở đâu không nhé :<";
    }
    else {
      response.text = "Đây là một số đề xuất dành cho bạn, nếu có giáo viên bạn cần tìm hãy gõ lại ngay bên dưới nhé:";
      listRecommendedTeachers.forEach(teacher => {
        response.text += `\n${teacher}`;
      });
    }
    sendResponse(sender_psid, response);
    return false;
  }
}

function checkGroup(sender_psid, group) {
  const checkArray = groupsCheckArray;
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

function extractExtName(url) {
    var extName;
    //find & remove protocol (http, ftp, etc.) and get extName
    // ex: https://cdn.fbsbx.com/v/t59.2708-21/71312832_535705970617099_1529285679119335424_n.gif
    if (url.indexOf("//") > -1) {
        extName = url.split('/')[5].split('.');
        if(extName.length >= 2) extName = extName[1];
    }
    else {
        extName = url.split('/')[0];
    }
    //find & remove port number
    extName = extName.split(':')[0];
    //find & remove "?"
    extName = extName.split('?')[0];

    return extName;
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
