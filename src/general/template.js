const groupsCheckArray = [
  '10t1', '10t2', '10l', '10h', '10si', '10ti', '10v1', '10v2', '10su', '10d','10a1', '10a2',
  '11t', '11l', '11h', '11si', '11ti', '11v', '11su', '11d','11c1','11c2', '11a1', '11a2',
  '12t', '12l', '12h', '12si', '12ti', '12v', '12su', '12d', '12c1', '12c2', '12a1', '12a2'
];

const teachersCheckArray = [
  'PN.An',        'HTN.Ánh',   'LĐ.Điển',   'TN.Điệp',    'NT.Dịu',
  'NT.Dung',      'LT.Giang',  'NK.Hoàn',   'NT.Huế',     'ĐT.Hương',
  'NT.Hương',     'ĐT.Hường',  'VT.Huyến',  'TV.Kỷ',      'VT.Len',
  'NT.Linh',      'LT.Loan',   'NTM.Loan',  'VT.Lợi',     'NV.Mạnh',
  'NQ.Minh',      'LT.Mùi',    'NP.Nga',    'LV.Ngân',    'TTB.Ngọc',
  'HT.Nhân',      'NT.Nhung',  'NV.Phán',   'NTT.Phương', 'NT.Phương',
  'T.Quang',      'NTP.Thảo',  'HT.Thảo',   'NTT.Thuỷ',   'HTT.Thủy',
  'NTH.Trang',    'LH.Trang',  'NV.Tuấn',   'NT.Tuyết',   'NT.Vân',
  'TTB.Vân',      'NH.Vân',    'PH.Vân',    'TH.Xuân',    'NT.Yến (địa)',
  'Ngân/Nhân',    'PT.Bằng',   'NV.Bảo',    'NV.Bình',    'NT.Bình',
  'NT.Đức',       'NTT.Dung',  'NT.Hà(h)',  'NT.Hà(su)',  'LN.Hân',
  'VTT.Hằng',     'ĐT.Hiền',   'LTT.Hiền',  'PĐ.Hiệp',    'NT.Hoa',
  'NT.Hòa',       'VT.Huê',    'HL.Hương',  'VB.Huy',     'NH.Khánh',
  'NM.Lan',       'NT.Lê',     'NTH.Liên',  'NT.Loan',    'BM.Thủy',
  'NC.Trung',     'Trung/Vân', 'NT.Hường',  'Loan/Len',   'TK.Linh',
  'NP.Ly Ly',     'DTT.Nga',   'NV.Nga',    'HD.Ngọc',    'NT.Nguyệt',
  'NTT.Nhung',    'NP.Thảo',   'NT.Thu',    'ĐTT.Toàn',   'NĐ.Vang',
  'NT.Yến (anh)', 'Điển/Vang', 'Hiệp/Toàn', 'Hiền/Hà'
]

function userDataFrame(sender_psid) {
  return {
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
