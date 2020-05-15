// This file is just for structure TEXT response, and just like JSON file

module.exports = {
  "defaultResponse": {
    "text": "",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Menu",
        "payload": "menu",
        "image_url": ""
      }
    ]
  },
  "exitResponse": {
    "text": "(!) Thoát thành công! Trở lại với Jay :3",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Menu",
        "payload": "menu",
        "image_url": ""
      }
    ]
  },
  "liveChatExitResponse": {
    "text": "Không muốn tiếp tục trò chuyện nữa thì nhập Exit nha 🐧",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Exit",
        "payload": "exit",
        "image_url": ""
      }
    ]
  },
  "payload_otherFeaturesResponse": {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": `- Nhập ngủ + thời điểm ngủ để xác định thời điểm nên thức dậy.
VÍ DỤ: ngủ 21h30
(Nếu bạn bỏ trống thời điểm ngủ, tớ sẽ lấy thời điểm hiện tại)
- Nhập dậy + thời điểm dậy để xác định thời điểm nên ngủ.
VÍ DỤ: dậy 6h15
(Nếu bạn bỏ trống thời điểm dậy, tớ sẽ lấy mặc định 6h)`,
        "buttons": [
          {
            "type": "postback",
            "title": "Tình hình Covid",
            "payload": "checkCovid"
          }
        ]
      }
    }
  },
  "listGeneralCommands": {
    "text": `
- lệnh: Danh sách tất cả các lệnh
- hd: Hướng dẫn sử dụng
- help: Gọi người hỗ trợ (Live chat)
- exit: Thoát tính năng đang sử dụng
- dsl:  Danh sách các lớp
- dsgv: Danh sách giáo viên`,
    "quick_replies": [
      {
        "content_type": "text",
        "title": "lệnh",
        "payload": "allCommands",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "hd",
        "payload": "ref",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "help",
        "payload": "liveChat",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "dsl",
        "payload": "listGroups",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "dsgv",
        "payload": "listTeachers",
        "image_url": ""
      }
    ]
  },
  "listInitFeatureCommands": {
    "text": `
- tkb: Tra thời khoá biểu
- dạy: Tra lịch dạy học
- covid: Tình hình dịch bệnh hiện tại
- dậy + thời điểm dậy: Xác định thời điểm nên ngủ (ví dụ: dậy 6h15)
- ngủ + thời điểm ngủ: Xác định thời điểm nên thức dậy (ví dụ: ngủ 21h15)`,
    "quick_replies": [
      {
        "content_type": "text",
        "title": "tkb",
        "payload": "searchSchedule",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "dạy",
        "payload": "searchClasses",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "covid",
        "payload": "checkCovid",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "ngủ",
        "payload": "estimateWakeUpTime",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "dậy",
        "payload": "estimateSleepTime",
        "image_url": ""
      }
    ]
  },
  "listSettingCommands": {
    "text": `
- lop + tên lớp: Cập nhật thời khoá biểu và bỏ qua bước nhập tên lớp khi sử dụng tính năng Tra thời khoá biểu
  + xemlop: Xem tên lớp đã cài đặt
  + xoalop:  Xoá tên lớp đã cài đặt

- gv + tên giáo viên: Cập nhật lịch dạy và bỏ qua bước nhập tên giáo viên khi sử dụng tính năng Tra lịch dạy
  + xemgv: Xem tên giáo viên đã cài đặt
  + xoagv: Xoá tên giáo viên đã cài đặt

- wd + thời gian (phút): Cài đặt thời gian trung bình để chìm vào giấc ngủ để thuận tiện trong việc xác định thời gian dậy (ngủ) dựa trên thời gian đó của bạn khi sử dụng tính năng Tính giờ dậy hoặc Tính giờ ngủ (tạm gọi: wind down)
  + xemwd: Xem thời gian trung bình để chìm vào giấc ngủ đã cài đặt
  + xoawd: Đổi thời gian trung bình để chìm vào giấc ngủ về mặc định (14')`,
    "quick_replies": [
      {
        "content_type": "text",
        "title": "xemlop",
        "payload": "xemlop",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xoalop",
        "payload": "xoalop",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xemgv",
        "payload": "xemgv",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xoagv",
        "payload": "xoagv",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xemwd",
        "payload": "xemwd",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xoawd",
        "payload": "xoawd",
        "image_url": ""
      }
    ]
  },
  "recommendedSetGroup": {
    "text": "Để mỗi lần sử dụng tính năng tra thời khoá biểu bạn không phải mất công ghi lại tên lớp nhiều lần nếu phải tra lớp đó thường xuyên (lớp bạn chẳng hạn), nhập lop + tên lớp.\nVí dụ: lop 11ti",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Danh sách lớp",
        "payload": "groupsList",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xemlop",
        "payload": "xemlop",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xoalop",
        "payload": "xoalop",
        "image_url": ""
      }
    ]
  },
  "recommendedSetTeacher": {
    "text": "Để mỗi lần sử dụng tính năng tra tiết dạy bạn không phải mất công ghi lại tên giáo viên nhiều lần nếu phải tra lịch dạy của giáo viên đó thường xuyên, nhập gv + tên giáo viên.\nVí dụ: gv NT.A",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Danh sách giáo viên",
        "payload": "teachersList",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xemgv",
        "payload": "xemgv",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xoagv",
        "payload": "xoagv",
        "image_url": ""
      }
    ]
  },
  "recommendedSetWindDown": {
    "text": "Trung bình một người thường mất 14' để chìm vào giấc ngủ. Để thuận tiện hơn trong việc xác định thời điểm dậy (ngủ) dựa trên thời gian trung bình để chìm vào giấc ngủ của bạn khi sử dụng các tính năng Tính giờ dậy và Tính giờ ngủ, nhập wd + thời gian (tính theo phút)\nVí dụ: wd 480",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "xemwd",
        "payload": "xemwd",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xoawd",
        "payload": "xoawd",
        "image_url": ""
      }
    ]
  },
  "lopResponse": {
    "text": "",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "tkb",
        "payload": "tkb",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xemlop",
        "payload": "xemlop",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xoalop",
        "payload": "xoalop",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Menu",
        "payload": "menu",
        "image_url": ""
      }
    ]
  },
  "gvResponse": {
    "text": "",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "dạy",
        "payload": "dạy",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xemgv",
        "payload": "xemgv",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xoagv",
        "payload": "xoagv",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Menu",
        "payload": "menu",
        "image_url": ""
      }
    ]
  },
  "wdResponse": {
    "text": "",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "xemwd",
        "payload": "xemwd",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xoawd",
        "payload": "xoawd",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Menu",
        "payload": "menu",
        "image_url": ""
      }
    ]
  },
  "xemlopResponse": {
    "text": "",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "tkb",
        "payload": "tkb",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xoalop",
        "payload": "xoalop",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Menu",
        "payload": "menu",
        "image_url": ""
      }
    ]
  },
  "xemgvResponse": {
    "text": "",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "dạy",
        "payload": "dạy",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xoagv",
        "payload": "xoagv",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Menu",
        "payload": "menu",
        "image_url": ""
      }
    ]
  },
  "xemwdResponse": {
    "text": "",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "xoawd",
        "payload": "xoawd",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Menu",
        "payload": "menu",
        "image_url": ""
      }
    ]
  },
  "searchScheduleAskGroup": {
    "text": "Bạn tìm lớp nào? \n(Ví dụ: 11ti, ...)",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Danh sách lớp",
        "payload": "groupsList",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Đặt lớp mặc định",
        "payload": "lop",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Exit",
        "payload": "exit",
        "image_url": ""
      }
    ]
  },
  "searchClassesAskTeacher": {
    "text": "Tên của giáo viên bạn tìm?\nVí dụ: NT.A",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Danh sách giáo viên",
        "payload": "teachersList",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Đặt gv mặc định",
        "payload": "setTeacher",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Exit",
        "payload": "exit",
        "image_url": ""
      }
    ]
  },
  "checkGroupResponse": {
    "text": "",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Danh sách lớp",
        "payload": "groupsList",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Exit",
        "payload": "exit",
        "image_url": ""
      }
    ]
  },
  "checkTeacherNameResponse": {
    "text": "",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Danh sách giáo viên",
        "payload": "teachersList",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Exit",
        "payload": "exit",
        "image_url": ""
      }
    ]
  },
  "estimateTimeResponse": {
    "text": "",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Đổi thời gian tb",
        "payload": "changeAverageWdTime",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xemwd",
        "payload": "xemwd",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "xoawd",
        "payload": "xoawd",
        "image_url": ""
      }
    ]
  },
  "askDay": {
    "text": "",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "",
        "payload": "",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Hôm nay",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Ngày mai",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Hôm qua",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Tất cả",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "2",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "3",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "4",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "5",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "6",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "7",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Chủ nhật",
        "payload": "day",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Exit",
        "payload": "exit",
        "image_url": ""
      }
    ]
  },
  'groupList': {
    "text": `
+ Lớp 10: 10t1, 10t2, 10l, 10h, 10si, 10ti, 10v1, 10v2, 10su, 10d, 10a1, 10a2.

+ Lớp 11: 11t, 11l, 11h, 11si, 11ti, 11v, 11su, 11d, 11c1, 11c2, 11a1, 11a2.

+ Lớp 12: 12t, 12l, 12h, 12si, 12ti, 12v, 12su, 12d, 12c1, 12c2, 12a1, 12a2.

Bạn có thể tiếp tục nhập dữ liệu nếu ĐANG sử dụng tính năng tìm kiếm...`
  },
  "teacherList": {
    "text": `
Danh sách giáo viên bạn có thể tra:
( A ) PN.An HTN.Ánh
-----
( B ) NT.Bình NV.Bảo PT.Bằng NV.Bình
-----
( C ) LX.Cường
-----
( D ) NTT.Dung NT.Dịu NT.Dung
-----
( Đ ) TN.Điệp LĐ.Điển NT.Đô NT.Đức
-----
( G ) LT.Giang NT.Giang
-----
( H ) NTT.Huyền HT.Hà VT.Huyến NK.Hoàn NT.Hương BT.Hưng ĐT.Hường NT.Huế ĐT.Hương NT.Hà(h) VTT.Hằng HL.Hương ĐT.Hiền NT.Hường NT.Hà(su) NT.Hòa LTT.Hiền PĐ.Hiệp VT.Huê NT.Hoa NQ.Huy VB.Huy LN.Hân
-----
( K ) TV.Kỷ NH.Khánh TT.Khanh VD.Khanh
-----
( L ) TK.Linh LT.Loan NT.Linh VT.Len D.Liễu NTM.Loan NT.Loan NTH.Liên NT.Lê NT.Lệ VT.Lợi NM.Lan (NP.Ly Ly)
-----
( M ) LT.Mùi NQ.Minh NV.Mạnh
-----
( N ) NT.Nga TTB.Ngọc NT.Nhung HT.Nhân LV.Ngân NP.Nga DTT.Nga NV.Nga NT.Nguyệt HD.Ngọc NTT.Nhung
-----
( O ) VK.Oanh
-----
( P ) NV.Phán NTT.Phương
-----
( Q ) TH.Quang
-----
( S ) Shaine
-----
( T ) NV.Tuấn HT.Thảo TT.Trang NTH.Trang NT.Thu HTT.Thủy NTT.Thuỷ LH.Trang NTP.Thảo NT.Tuyết CT.Thúy NT.Thuý NP.Thảo NC.Trung BM.Thủy HT.Toan ĐTT.Toàn
-----
( V ) NH.Vân PH.Vân NT.Vân TTB.Vân NĐ.Vang LT.Vui
-----
( X ) TH.Xuân
-----
( Y ) (NT.Yến (đ)) (NT.Yến (nn))

Bạn có thể tiếp tục nhập dữ liệu nếu ĐANG sử dụng tính năng tìm kiếm...`
  },
  "groupsCheckArray": [
    '10t1', '10t2', '10l', '10h', '10si', '10ti', '10v1', '10v2', '10su', '10d','10a1', '10a2',
    '11t', '11l', '11h', '11si', '11ti', '11v', '11su', '11d','11c1','11c2', '11a1', '11a2',
    '12t', '12l', '12h', '12si', '12ti', '12v', '12su', '12d', '12c1', '12c2', '12a1', '12a2'
  ],
  "teachersCheckArray": [
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
}
