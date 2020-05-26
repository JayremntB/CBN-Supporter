const groupsCheckArray = [
  '10t1', '10t2', '10l', '10h', '10si', '10ti', '10v1', '10v2', '10su', '10d','10a1', '10a2',
  '11t', '11l', '11h', '11si', '11ti', '11v', '11su', '11d','11c1','11c2', '11a1', '11a2',
  '12t', '12l', '12h', '12si', '12ti', '12v', '12su', '12d', '12c1', '12c2', '12a1', '12a2'
];

const teachersCheckArray = [
  'LT.Giang',  'NT.Bình',   'VT.Huyến',  'TN.Điệp',   'NV.Tuấn',
'NT.Đô',     'NT.Hoa',    'NT.Vân',    'TT.Trang',  'NT.Yến (đ)',
'NK.Hoàn',   'NTT.Huyền', 'PH.Vân',    'HT.Hà',     'TK.Linh',
'Shaine',    'NH.Vân',    'TH.Quang',  'LT.Mùi',    'NTH.Trang',
'NTT.Dung',  'TV.Kỷ',     'LT.Loan',   'NV.Phán',   'NT.Hương',
'NT.Thu',    'NT.Linh',   'NT.Giang',  'ĐT.Hường',  'BT.Hưng',
'TH.Xuân',   'TTB.Vân',   'NT.Huế',    'HTT.Thủy',  'NQ.Minh',
'NTT.Thuỷ',  'ĐT.Hương',  'HTN.Ánh',   'NT.Nga',    'LH.Trang',
'NT.Dịu',    'ND.Liễu',   'NT.Hà(h)',  'VD.Khanh',  'HT.Thảo',
'PN.An',     'NTP.Thảo',  'NP.Nga',    'VT.Len',    'NTM.Loan',
'NV.Mạnh',   'TTB.Ngọc',  'NT.Dung',   'LĐ.Điển',   'VTT.Hằng',
'NT.Thúy',   'NT.Tuyết',  'NT.Nhung',  'HL.Hương',  'LV.Ngân',
'Ngân/Nhân', 'NT.Hòa',    'NP.Thảo',   'HT.Nhân',   'NTT.Phương',
'VK.Oanh',   'CT.Thúy',   'NC.Trung',  'ĐT.Hiền',   'NT.Đức',
'NT.Hường',  'NT.Loan',   'BM.Thủy',   'NV.Bảo',    'NT.Lê',
'NTH.Liên',  'NT.Lệ',     'NT.Hà(su)', 'NH.Khánh',  'TT.Khanh',
'HT.Toan',   'LTT.Hiền',  'ĐTT.Toàn',  'DTT.Nga',   'LX.Cường',
'PĐ.Hiệp',   'VT.Lợi',    'PT.Bằng',   'NT.Nguyệt', 'NT.Yến (nn)',
'NV.Nga',    'NĐ.Vang',   'NQ.Huy',    'VT.Huê',    'NV.Bình',
'NTT.Nhung', 'HD.Ngọc',   'VB.Huy',    'LT.Vui',    'NM.Lan',
'LN.Hân',    'NP.Ly Ly'
]

function userDataFrame(sender_psid) {
  return {
    sender_psid: sender_psid,
    group: "",
    teacher: "",
    wind_down_time: 14,
    main_schedule: [],
    main_teach_schedule: [],
    search_schedule_block: false,
    search_classes_block: false,
    search_schedule_other_group: {
      block: false,
      group: "",
      schedule: []
    },
    search_classes_other_teacher: {
      block: false,
      teacher: "",
      teaches: []
    },
    room_chatting: {
      block: false,
      has_joined: false,
      type: "",
      create_new_subroom: false,
      room_id: "",
      pre_room: 1,
      persona_id: "3363745553659185",
      name: "Người lạ",
      img_url: "https://i.imgur.com/187Y4u3.png"
    },
    live_chat: false
  }
}

function userDataUnblockSchema(userData) {
  return {
    main_schedule: [],
    main_teach_schedule: [],
    search_schedule_block: false,
    search_classes_block: false,
    search_schedule_other_group: {
      block: false,
      group: "",
      schedule: []
    },
    search_classes_other_teacher: {
      block: false,
      teacher: "",
      teaches: []
    },
    room_chatting: {
      block: false,
      has_joined: false,
      type: "",
      create_new_subroom: false,
      room_id: "",
      pre_room: userData.room_chatting.pre_room,
      persona_id: userData.room_chatting.persona_id,
      name: userData.room_chatting.name,
      img_url: userData.room_chatting.img_url
    },
    live_chat: false
  };
}

module.exports = {
  groupsCheckArray: groupsCheckArray,
  teachersCheckArray: teachersCheckArray,
  userDataFrame: userDataFrame,
  userDataUnblockSchema: userDataUnblockSchema
};
