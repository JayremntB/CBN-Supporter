const groupsCheckArray = [
  '10t1', '10t2', '10l', '10h', '10si', '10ti', '10v1', '10v2', '10su', '10d','10a1', '10a2',
  '11t1', '11t2', '11l', '11h', '11si', '11ti', '11v1', '11v2', '11su', '11d', '11a1', '11a2',
  '12t', '12l', '12h', '12si', '12ti', '12v', '12su', '12d', '12c1', '12c2', '12a1', '12a2'
];

const teachersCheckArray = [
  'TN.Điệp',      'NĐ.Vang',      'LĐ.Điển',   'PĐ.Hiệp',  'NT.Linh',
  'VD.Khanh',     'VT.Huê',       'NP. Anh',   'TT.Trang', 'ĐB.Thảo',
  'NT.Loan (sử)', 'ND.Liễu',      'NTT.Dung',  'NQ.Minh',  'HT.Hà',
  'NC.Trung',     'NTP.Thảo',     'VB.Huy',    'PH.Trang', 'NH.Vân',
  'NV.Nga',       'NT.Chinh',     'NTT.Nhung', 'NT.Thúy',  'NT.Lê',
  'NT.Lương',     'NT.Nhung',     'NT.Hương',  'NT.Hà(h)', 'NT.Huế',
  'ĐT.Hiền',      'NV.Bình',      'NT.Hà (h)', 'NTH.Liên', 'TV.Kỷ',
  'NT.Loan',      'NT.Lệ',        'NT.Hường',  'NT.Hoa',   'NT.Hòa',
  'NT.Bình',      'NT.Yến (đ)',   'NT.Tuyết',  'BT.Hưng',  'NM.Lan',
  'NH.Trang',     'PN.An',        'LH.Trang',  'NH.Khánh', 'NP.Thảo',
  'NT.Đức',       'NT.Thu',       'NP.Nga',    'TTB.Vân',  'HL.Hương',
  'HD.Ngọc',      'NV.Phán',      'NK.Hoàn',   'HTT.Thủy', 'NTT.Huyền',
  'LN.Hân',       'NT.Yến (nn)',  'NP.Ly Ly',  'LT.Giang', 'NV.Tuấn',
  'ĐT.Hường',     'PH.Vân',       'NT.Giang',  'HT.Thảo',  'NT.Vân',
  'TK.Linh',      'N.Phương Anh', 'NQ.Huy',    'ĐTT.Toàn', 'T.Quang',
  'LT.Mùi',       'BM.Thủy',      'NTH.Trang', 'NT.Đô',    'TT.Khanh',
  'Đô/Vang',      'NV.Mạnh',      'LT.Loan',   'Kỷ/Trang', 'VT.Lợi',
  'TH.Xuân',      'NTT.Thuỷ',     'HTN.Ánh',   'NTM.Loan', 'NT.Nga',
  'VT.Len',       'NV.Bảo',       'TTB.Ngọc',  'NT.Dung',  'VT.Huyến',
  'HT.Nhân',      'LV.Ngân',      'VTT.Hằng', 'Trung/Vân', 'LTT.Hiền',
'DTT.Nga',
'NT.Hà(su)',
'NT.Nguyệt',
'PT.Bằng',
]

function userDataFrame(sender_psid, name) {
  return {
    name: name,
    sender_psid: sender_psid,
    group: "",
    teacher: "",
    wind_down_time: 14,
    schedule_updated_time: "",
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
    search_groups_taught: {
      block: false,
      subject: "",
      list_groups: []
    },
    find_images: {
      block: false,
      img_now: 1,
      list_images: []
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
    search_groups_taught: {
      block: false,
      subject: "",
      list_groups: []
    },
    find_images: {
      block: false,
      img_now: 1,
      list_images: []
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
