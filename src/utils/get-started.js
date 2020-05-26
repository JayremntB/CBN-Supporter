const sendResponse = require('../general/sendResponse');
const typing = require('../general/typing');

module.exports = function(sender_psid) {
  let response = {
    "text": "Xin chào! Tớ tên Jay, rất vui được gặp bạn :D Tớ được thiết lập sẵn để cung cấp cho bạn các tính năng có trong Menu, cứ thoải mái vung tay mà sử dụng nhé :>"
  };
  sendResponse(sender_psid, response);
  typing(sender_psid);
  setTimeout(() => {
    response.text = `(*) Khuyến nghị: Đọc kỹ hướng dẫn sử dụng trước khi dùng 😴(Bắt buộc nếu bạn dùng nền tảng Messenger Lite): https://github.com/JayremntB/CBN-Supporter-How-to-use/blob/master/README.md`
    sendResponse(sender_psid, response);
    typing(sender_psid);
    setTimeout(()=> {
      response.text = "Nếu bạn cần hỗ trợ hay muốn góp ý, gợi ý một số tính năng nào đó cho tớ, hãy liên hệ với thằng coder qua phần Hỗ trợ dưới Menu hoặc nhập Help nha 😚\nĐược rồi, bắt đầu sử dụng đi 😉"
      sendResponse(sender_psid, response);
      typing(sender_psid);
    }, 2200);
  }, 3100);
}
