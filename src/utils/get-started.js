const sendResponse = require('../general/sendResponse');

module.export = function(client, sender_psid) {
  let response = {
    "text": "Xin chào! Tớ tên Jay, rất vui được gặp cậu :D Tớ được thiết lập sẵn để cung cấp cho cậu các tính năng có trong Menu, cứ thoải mái vung tay mà sử dụng nhé :>"
  };
  sendResponse(sender_psid, response);
  setTimeout(() => {
    response.text = `(!) Khuyến nghị (Có thể bỏ qua hoặc đặt lại qua menu):
Gõ setclass + tên lớp để bỏ qua bước gõ tên lớp khi bạn sử dụng tính năng tra thời khoá biểu\n(Ví dụ: setclass 11ti)`
    sendResponse(sender_psid, response);
    setTimeout(()=> {
      response.text = "Đừng lo, khi cậu muốn tra lớp khác, tớ sẽ có một cái button để giúp cậu tra mà không ảnh hưởng đến lớp cậu đã cài đặt :D"
      sendResponse(sender_psid, response);
    }, 1000);
  }, 1000);
  client.db('database-for-cbner').collection(users-data).insertOne({
    sender_psid: sender_psid,
    group: "",
    main_schedule: [],
    setting_block: false,
    search_schedule_block: false,
    search_schedule_other_group: {
      block: false,
      group: "",
      schedule: []
    },
    search_classes: {
      block: false,
      teacher: "",
      teaches: []
    },
    search_subject: {
      block: false,
      subject: "",
      day: "",
      time: ""
    }
  })
}
