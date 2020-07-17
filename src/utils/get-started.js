const sendResponse = require('../general/sendResponse');
const typing = require('../general/typing');

module.exports = function(sender_psid) {
  setTimeout(() => {
    let response = {
      "text": "Xin chào! Tớ tên Jay, rất vui được gặp bạn :D Tớ được thiết lập sẵn để cung cấp cho bạn các tính năng có trong Menu, cứ thoải mái vung tay mà sử dụng nhé :>"
    };
    sendResponse(sender_psid, response);
    typing(sender_psid);
    setTimeout(()=> {
      response = {
        "text": "Nếu bạn cần hỗ trợ hay muốn góp ý, gợi ý một số tính năng nào đó cho tớ, hãy liên hệ với thằng coder qua phần Hỗ trợ dưới Menu hoặc nhập Help nha 😚"
      };
      sendResponse(sender_psid, response);
      typing(sender_psid);
      setTimeout(() => {
        response = {
          "text": "Ngoài ra, bạn có thể xả stress với bé SimSimi bằng cách nhắn tin trực tiếp cho tớ, Sim sẽ trả lời ngay lập tức nhé!\nĐược rồi, nhập Menu để bắt đầu sử dụng nha 😉",
          "quick_replies": [
            {
              "content_type": "text",
              "title": "Menu",
              "payload": "menu",
              "image_url": ""
            }
          ]
        };
        sendResponse(sender_psid, response);
        typing(sender_psid);
      }, 2000);
    }, 3100);
  }, 2500);
}
