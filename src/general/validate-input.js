const sendResponse = require('./sendResponse');
const stuff = require('./stuff');

module.exports = {
  checkTeacherName: checkTeacherName,
  checkGroup: checkGroup
}

function checkTeacherName(sender_psid, teacherName) {
  const checkArray = stuff.teachersCheckArray;
  if(checkArray.includes(teacherName)) return true;
  else {
    let response = stuff.checkTeacherNameResponse;
    response.text = "Tên giáo viên không có trong danh sách. Kiểm tra lại xem bạn có viết nhầm hay không nhé.\nNhầm thì viết lại luôn nha :>";
    sendResponse(sender_psid, response);
    return false;
  }
}

function checkGroup(sender_psid, group) {
  const checkArray = stuff.groupsCheckArray;
  if(checkArray.includes(group)) return true;
  else {
    let response = stuff.checkGroupResponse;
    response.text = "Tên lớp không có trong danh sách. Kiểm tra lại xem bạn có viết nhầm hay không nhé.\nNhầm thì viết lại luôn nha :>"
    sendResponse(sender_psid, response);
    return false;
  }
}
