module.exports = { 
  "searchScheduleAskGroup": {
    "text": "Cậu tìm lớp nào? \n(Ví dụ: 11ti)",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Exit",
        "payload": "exit",
        "image_url": ""
      }
    ]
  },
  "searchScheduleAskDay": {
    "text": "Cậu muốn tra thứ mấy?",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Ghi lại lớp",
        "payload": "searchScheduleOverwriteClass",
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
  "searchScheduleCheckGroupResponse": {
    "text": `Tên lớp không có trong danh sách :( Kiểm tra lại xem cậu có viết nhầm hay không nhé :^)\nNếu viết nhầm thì viết lại tên lớp luôn nha :>`,
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Exit",
        "payload": "exit",
        "image_url": ""
      }
    ]
  }
}
