module.exports = {
  "exitResponse": {
    "text": "(!) Đã quay lại chat với Jay.",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Menu",
        "payload": "menu",
        "image_url": ""
      }
    ]
  },
  "listCommands": {
    "text": `Các lệnh tớ hỗ trợ:
* Chung:
- lệnh: danh sách tập lệnh
- hd: hướng dẫn
- help: gọi người hỗ trợ (Live chat)
- exit: dừng tính năng đang sử dụng
- dsl:  danh sách các lớp
- dsgv: danh sách giáo viên

* Lệnh kích hoạt tính năng:
- tkb: tra thời khoá biểu
- dạy: tìm lịch dạy học của giáo viên
- covid: tình hình dịch bệnh hiện tại
- dậy + thời gian: Xác định thời điểm ngủ
- ngủ + thời gian: Xác định thời điểm thức dậy

* Lệnh cài đặt và đi kèm:
- setclass + tên lớp: cập nhật thời khoá biểu và bỏ qua bước gõ tên lớp khi sử dụng tính năng tra thời khoá biểu
+ viewclass: xem tên lớp đã cài đặt
+ delclass:  xoá tên lớp đã cài đặt`,
    "quick_replies": [
      {
        "content_type": "text",
        "title": "help",
        "payload": "liveChat",
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
        "title": "ngủ",
        "payload": "estimateWakeUpTime",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "dậy",
        "payload": "estimateSleepTime",
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
        "title": "viewclass",
        "payload": "viewClass",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "delclass",
        "payload": "delClass",
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
  "checkGroupResponse": {
    "text": "",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Danh sách lớp",
        "payload": "classList",
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
  "searchScheduleAskGroup": {
    "text": "Bạn tìm lớp nào? \n(Ví dụ: 11ti, ...)",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Danh sách lớp",
        "payload": "classList",
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
    "text": "Tên của giáo viên bạn tìm?\n(Ví dụ: NT.Lê, NQ.Minh, ...)",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Danh sách giáo viên",
        "payload": "teacherList",
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
  "checkGroupResponse": {
    "text": "",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Danh sách lớp",
        "payload": "classList",
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
        "payload": "teacherList",
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
    "text": `Đây là danh sách lớp bạn có thể tra:
+ Lớp 10: 10t1, 10t2, 10l, 10h, 10si, 10ti, 10v1, 10v2, 10su, 10d, 10a1, 10a2.

+ Lớp 11: 11t, 11l, 11h, 11si, 11ti, 11v, 11su, 11d, 11c1, 11c2, 11a1, 11a2.

+ Lớp 12: 12t, 12l, 12h, 12si, 12ti, 12v, 12su, 12d, 12c1, 12c2, 12a1, 12a2.`
  },
  "teacherList": {
    "text": `A PN.An HTN.Ánh
-----
B NT.Bình NV.Bảo PT.Bằng NV.Bình
-----
D NTT.Dung NT.Dịu NT.Dung
-----
Đ TN.Điệp LĐ.Điển NT.Đức
-----
G LT.Giang NT.Giang
-----
H NTT.Huyền HT.Hà VT.Huyến NK.Hoàn NT.Hương BT.Hưng ĐT.Hường NT.Huế ĐT.Hương NT.Hà(h) VTT.Hằng HL.Hương ĐT.Hiền NT.Hường NT.Hà(su) NT.Hòa LTT.Hiền PĐ.Hiệp VT.Huê NT.Hoa VB.Huy LN.Hân
-----
K TV.Kỷ NH.Khánh TT.Khanh
-----
L TK.Linh LT.Loan NT.Linh VT.Len D.Liễu NTM.Loan NT.Loan NTH.Liên NT.Lê NT.Lệ VT.Lợi NM.Lan (NP.Ly Ly)
-----
M LT.Mùi NQ.Minh NV.Mạnh
-----
N NT.Nga TB.Ngọc TTB.Ngọc NT.Nhung HT.Nhân LV.Ngân NP.Nga DTT.Nga NV.Nga NT.Nguyệt HD.Ngọc NTT.Nhung
-----
P NV.Phán NTT.Phương
-----
Q TH.Quang
-----
T NV.Tuấn HT.Thảo TT.Trang NTH.Trang NT.Thu HTT.Thủy NTT.Thuỷ LH.Trang PH.Trang NTP.Thảo NT.Tuyết CT.Thúy NP.Thảo NC.Trung BM.Thủy ĐTT.Toàn
-----
V NH.Vân PH.Vân NT.Vân TTB.Vân NĐ.Vang
-----
X TH.Xuân
-----
Y (NT.Yến (đ)) (TT.Yến) (NT.Yến (nn))`
  }
}
