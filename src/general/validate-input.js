const sendResponse = require('./sendResponse');
const stuff = require('./stuff');

module.exports = {
  checkTeacherName: checkTeacherName,
  checkGroup: checkGroup,
  checkWindDownTime: checkWindDownTime
}

function checkTeacherName(sender_psid, teacherName) {
  const checkArray = [
    'PN.An',       'NT.Bình',  'NV.Bảo',    'PT.Bằng',    'NV.Bình',
    'NTT.Dung',    'NT.Dịu',   'NT.Dung',   'LT.Giang',   'NT.Giang',
    'NTT.Huyền',   'HT.Hà',    'VT.Huyến',  'NK.Hoàn',    'NT.Hương',
    'BT.Hưng',     'ĐT.Hường', 'NT.Huế',    'ĐT.Hương',   'NT.Hà(h)',
    'VTT.Hằng',    'HL.Hương', 'ĐT.Hiền',   'NT.Hường',   'NT.Hà(su)',
    'NT.Hòa',      'LTT.Hiền', 'PĐ.Hiệp',   'VT.Huê',     'NT.Hoa',
    'VB.Huy',      'LN.Hân',   'TV.Kỷ',     'NH.Khánh',   'TT.Khanh',
    'TK.Linh',     'LT.Loan',  'NT.Linh',   'VT.Len',     'ND.Liễu',
    'NTM.Loan',    'NT.Loan',  'NTH.Liên',  'NT.Lê',      'NT.Lệ',
    'VT.Lợi',      'NM.Lan',   'NP.Ly Ly',  'LT.Mùi',     'NQ.Minh',
    'NV.Mạnh',     'NT.Nga',   'TB.Ngọc',   'TTB.Ngọc',   'NT.Nhung',
    'HT.Nhân',     'LV.Ngân',  'NP.Nga',    'DTT.Nga',    'NV.Nga',
    'NT.Nguyệt',   'HD.Ngọc',  'NTT.Nhung', 'NV.Phán',    'NTT.Phương',
    'TH.Quang',    'NV.Tuấn',  'HT.Thảo',   'TT.Trang',   'NTH.Trang',
    'NT.Thu',      'HTT.Thủy', 'NTT.Thuỷ',  'LH.Trang',   'PH.Trang',
    'NTP.Thảo',    'NT.Tuyết', 'CT.Thúy',   'NP.Thảo',    'NC.Trung',
    'BM.Thủy',     'ĐTT.Toàn', 'NH.Vân',    'PH.Vân',     'NT.Vân',
    'TTB.Vân',     'NĐ.Vang',  'TH.Xuân',   'NT.Yến (đ)', 'TT.Yến',
    'NT.Yến (nn)', 'HTN.Ánh',  'TN.Điệp',   'LĐ.Điển',    'NT.Đức',
    'TV.Điệp',     'NT.Đô',    'Shaine',    'VD.Khanh',   'VK.Oanh',
    'HT.Toan',     'LX.Cường', 'NQ.Huy',    'LT.Vui'
  ];
  if(checkArray.includes(teacherName)) return true;
  else {
    let response = stuff.checkTeacherNameResponse;
    response.text = "Tên giáo viên không có trong danh sách. Kiểm tra lại xem bạn có viết nhầm hay không nhé.\nNhầm thì viết lại luôn nha :>";
    sendResponse(sender_psid, response);
    return false;
  }
}

function checkGroup(sender_psid, group) {
  const checkArray = ['10t1', '10t2', '10l', '10h', '10si', '10ti', '10v1', '10v2', '10su', '10d','10a1', '10a2', '11t', '11l', '11h', '11si', '11ti', '11v', '11su', '11d','11c1','11c2', '11a1', '11a2', '12t', '12l', '12h', '12si', '12ti', '12v', '12su', '12d', '12c1', '12c2', '12a1', '12a2'];
  if(checkArray.includes(group)) return true;
  else {
    let response = stuff.checkGroupResponse;
    response.text = "Tên lớp không có trong danh sách. Kiểm tra lại xem bạn có viết nhầm hay không nhé.\nNhầm thì viết lại luôn nha :>"
    sendResponse(sender_psid, response);
    return false;
  }
}

function checkWindDownTime(sender_psid, time) {
  if(isNaN(time) || time < 0) {
    let response = stuff.defaultResponse;
    response.text = "Xin lỗi, tớ không hiểu thời gian bạn vừa nhập :(";
    sendResponse(sender_psid, response);
    return 0;
  }
  if(time >= 8 * 60) {
    let response = stuff.defaultResponse;
    response.text = "Thế thì thức luôn đi chứ còn ngủ gì nữa @@";
    sendResponse(sender_psid, response);
    return 0;
  }
  return 1;
}
