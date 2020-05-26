const request = require('request');
const sendResponse = require('../general/sendResponse');
const templateResponse = require('../general/templateResponse');
const textResponse = require('../general/textResponse');
const { extractHostname } = require('../general/validate-input');
const { userDataUnblockSchema } = require('../general/template');

const dbName = 'database-for-cbner';

module.exports = {
  handleMessage: handleMessage,
  joinGeneralRoom: joinGeneralRoom,
  joinSubRoom: joinSubRoom,
  selectRoom: selectRoom,
  settingName: settingName,
  settingAvatar: settingAvatar,
  createSubRoom: createSubRoom,
  joinRandomRoom: joinRandomRoom,
  joinPreRoom: joinPreRoom,
  leaveRoom: leaveRoom,
  userInfo: userInfo,
  roomInfo: roomInfo
}

function handleMessage(client, text, userData, attachment_url) {
  // if has joined an exist room, send message
  if(userData.room_chatting.has_joined) {
    client.db(dbName).collection('room-chatting').findOne({ room_id: userData.room_chatting.room_id }, (err, res) => {
      if(err) console.log(err);
      else {
        let message = {
          "text": text
        };
        // if user send attachment
        if(attachment_url) message = returnMessageBelongWithHostname(attachment_url);
        sendNewPersonaMessage(res.list_users, message, userData);
      }
    });
  }
  else {
    const type = userData.room_chatting.type;
    // NOT have generalRoom type cause if there had, it would already have "has_joined" attribute = true
    if(type === "subRoom") {
      const limitUsers = text.split(" ")[0];
      if(!isNaN(limitUsers) && limitUsers <= 6) { // max users = 6
         if(!userData.room_chatting.create_new_subroom) {
           findValidRoom(client, userData, limitUsers);
         }
         else createNewSubRoom(client, userData, limitUsers);
      }
      else {
        const response = {
          "text": "Giới hạn người không hợp lệ, hãy nhập lại..."
        };
        sendResponse(userData.sender_psid, response);
      }
    }
    else if(type === "selectRoom") findRoomByID(client, userData, Number(text));
    else if(type === "settingName") getPersonaID(client, text, userData.room_chatting.img_url, userData);
    else if(type === "settingAvatar") getPersonaID(client, userData.room_chatting.name, attachment_url === undefined ? text : attachment_url, userData);
  }
}

function findRoomByID(client, userData, room_id) {
  client.db(dbName).collection('room-chatting').findOne({ room_id: room_id }, (err, res) => {
    let response = {
      "text": ""
    }
    if(err) console.log(err);
    else if(!res) {
      response.text = "Không tìm thấy phòng.\nHãy nhập lại ID phòng...";
      sendResponse(userData.sender_psid, response);
    }
    else if(res.list_users.length >= res.limit_users) {
      response.text = `Phòng đã đủ người, hãy vào lại sau.\nNhập phòng khác đi...`;
      sendResponse(userData.sender_psid, response);
    }
    else sendAnnouncement(client, userData, res);
  });
}

function findValidRoom(client, userData, limitUsers) {
  let response = {
    "text": ""
  };
  client.db(dbName).collection('room-chatting').findOne({
    $where: `this.limit_users == ${limitUsers}
    && this.list_users.length < this.limit_users
    && this.list_users.length > 0
    && this.room_id > 1`
  }, (err, res) => {
    if(err) console.log(err);
    else if(res) sendAnnouncement(client, userData, res);
    else {
      response = textResponse.subRoomResponse;
      response.text = "Không tìm thấy phòng trống hoặc có người. Hãy tìm phòng khác hoặc tạo phòng mới...";
      sendResponse(userData.sender_psid, response);
    }
  });
}

function joinGeneralRoom(client, userData) {
  initBlock(client, "generalRoom", userData);
  let response = {
    "text": ""
  };
  // get room 01 (general room)
  client.db(dbName).collection('room-chatting').findOne({ room_id: 1 }, (err, res) => {
    const totalMembers = res.list_users.length;
    if(totalMembers === 0) {
      response.text = "Trong phòng hiện không có người nào...\nTớ sẽ thông báo khi có người vào phòng nhé!";
      sendResponse(userData.sender_psid, response);
    }
    sendAnnouncement(client, userData, res);
  });
}

function joinSubRoom(client, userData) {
  initBlock(client, "subRoom", userData);
  const response = templateResponse.subRoomResponse;
  sendResponse(userData.sender_psid, response);
}

function selectRoom(client, userData) {
  initBlock(client, "selectRoom", userData);
  let response = {
    "text": "Nhập ID phòng..."
  };
  sendResponse(userData.sender_psid, response);
}

function settingName(client, userData) {
  initBlock(client, "settingName", userData);
  const response = {
    "text": "Nhập tên bạn muốn hiển thị khi chat..."
  };
  sendResponse(userData.sender_psid, response);
}

function settingAvatar(client, userData) {
  initBlock(client, "settingAvatar", userData);
  const response = {
    "text": "Gửi hoặc nhập link ảnh của bạn..."
  };
  sendResponse(userData.sender_psid, response);
}

function sendAnnouncement(client, userData, room) {
  const response = {
    "text": `Đã vào phòng chat ${room.room_id}.\n${room.list_users.length} người đang chờ tin nhắn từ bạn, hãy chào mọi người đi :3`
  };
  sendResponse(userData.sender_psid, response);
  // send announcement for people in room
  const message = {
    "text": `${userData.room_chatting.name.toUpperCase()} đã vào phòng chat!`
  };
  sendNewPersonaMessage(room.list_users, message, userData, 1);
  setRoomID(client, room.room_id, userData);
}

async function createNewSubRoom(client, userData, limitUsers) {
  const room_id = await client.db(dbName).collection('room-chatting').countDocuments() + 1;
  client.db(dbName).collection('room-chatting').insertOne({
    room_id: room_id,
    limit_users: limitUsers
  }, (err, res) => {
    if(err) console.log(err);
    else {
      setRoomID(client, res.ops[0].room_id, userData);
      const response = {
        "text": `Tạo phòng thành công!\nID phòng của bạn là ${res.ops[0].room_id}\nTớ sẽ thông báo khi có người vào phòng nhé!`
      };
      sendResponse(userData.sender_psid, response);
    }
  });
}

function createSubRoom(client, userData) {
  initBlock(client, "subRoom", userData, true);
  let response = textResponse.subRoomResponse;
  response.text = "Chọn giới hạn số người...";
  sendResponse(userData.sender_psid, response);
}

function joinRandomRoom(client, userData) {
  client.db(dbName).collection('room-chatting').findOne({
    room_id: {
      $gt: 1
    },
    $where: "this.list_users.length > 0 && this.list_users.length < this.limit_users",
  }, (err, res) => {
    if(err) console.log(err);
    else if(res) {
      initBlock(client, "subRoom", userData);
      sendAnnouncement(client, userData, res);
    }
    else {
      const response = {
        "text": "Không tìm thấy phòng trống hoặc có người. Hãy tạo phòng mới và chờ, tớ sẽ thông báo cho bạn khi có người vào phòng nhé :>"
      };
      sendResponse(userData.sender_psid, response);
      client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
        $set: userDataUnblockSchema(userData)
      });
    }
  })
}

function joinPreRoom(client, userData) {
  client.db(dbName).collection('room-chatting').findOne({
    room_id: userData.room_chatting.pre_room,
    $where: "this.list_users.length < this.limit_users"
  }, (err, room) => {
    if(err) console.log(err);
    else if(room) {
      initBlock(client, "subRoom", userData);
      sendAnnouncement(client, userData, room);
    }
    else {
      const response = {
        "text": `Phòng đã đủ người, hãy vào lại sau.`
      };
      sendResponse(userData.sender_psid, response);
      client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
        $set: userDataUnblockSchema(userData)
      });
    }
  })
}

function leaveRoom(client, userData) {
  // remove user from current room
  client.db(dbName).collection('room-chatting').findOne({ room_id: userData.room_chatting.room_id }, (err, roomData) => {
    if(err) console.log(err);
    else if(roomData) {
      const response = textResponse.defaultResponse;
      response.text = "Đã rời khỏi phòng...";
      sendResponse(userData.sender_psid, response);
      // send announcement to users in current room
      const message = {
        "text": `${userData.room_chatting.name.toUpperCase()} đã rời khỏi phòng...`
      };
      sendNewPersonaMessage(roomData.list_users, message, userData, 1);
      // leave current room
      client.db(dbName).collection('room-chatting').updateOne({ room_id: userData.room_chatting.room_id }, {
        $pull: {
          list_users: userData.sender_psid
        }
      });
      // set all attributes of user's data to default
      let update = userDataUnblockSchema(userData);
      update.room_chatting.pre_room = roomData.room_id;
      client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
        $set: update
      });
    }
  });
}

function userInfo(userData) {
  let response = templateResponse.userChatRoomInfo;
  response.attachment.payload.text = `Tên hiển thị: ${userData.room_chatting.name}`;
  response.attachment.payload.buttons[0].url = userData.room_chatting.img_url;
  sendResponse(userData.sender_psid, response);
}

function roomInfo(client, userData) {
  client.db(dbName).collection('room-chatting').findOne({ room_id: userData.room_chatting.room_id }, (err, res) => {
    const response = {
      "text": `
ID phòng: ${res.room_id}
Số người trong phòng: ${res.list_users.length}
Giới hạn phòng: ${res.limit_users} người`
    }
    sendResponse(userData.sender_psid, response);
  });
}

function initBlock(client, type, userData, createSubRoom) {
  let update = userDataUnblockSchema(userData);
  update.room_chatting.block = true;
  update.room_chatting.type = type,
  update.room_chatting.create_new_subroom = createSubRoom === undefined ? false : true;
  client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
    $set: update
  });
}

function setRoomID(client, room_id, userData) {
  client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
    $set: {
      "room_chatting.block": true,
      "room_chatting.has_joined": true,
      "room_chatting.room_id": room_id
    }
  });
  client.db(dbName).collection('room-chatting').updateOne({ room_id: room_id }, {
    $push: {
      list_users: userData.sender_psid
    }
  });
}

function returnMessageBelongWithHostname(url) {
  // Forming message
  let message = templateResponse.personaSendAttachmentMessage;
  message.attachment.payload.buttons[0].url = url;
  // process hostname
  const hostname = extractHostname(url);
  let text = "";
  // return right text response belong with each hostname
  switch (hostname) {
    case 'cdn.fbsbx.com':
      text = "Đã gửi một file (audio, gif, excel, ...)\nLưu ý: Bạn sẽ cần tải về để xem";
      message.attachment.payload.buttons[0].title = "Tải về";
      break;
    case 'scontent.xx.fbcdn.net':
      text = "Đã gửi một ảnh";
      message.attachment.payload.buttons[0].title = "Xem";
      break;
    case 'video.xx.fbcdn.net':
      text = "Đã gửi một video";
      message.attachment.payload.buttons[0].title = "Xem";
      break;
    case 'l.facebook.com':
      text = "Đã gửi vị trí";
      message.attachment.payload.buttons[0].title = "Xem";
      break;
  }
  message.attachment.payload.text = text;
  return message;
}

function getPersonaID(client, name, imgUrl, userData) {
  request({
    "uri": "https://graph.facebook.com/me/personas",
    "qs": { access_token: process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": {
    	"name": name,
    	"profile_picture_url": imgUrl,
    }
  }, (err, res, body) => {
    if(err) console.log(err);
    else if(body.id) {
      const response = {
        "text": "Cài đặt thành công!"
      };
      sendResponse(userData.sender_psid, response);
      //
      client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
        $set: {
          "room_chatting.block": false,
          "room_chatting.type": "",
          "room_chatting.persona_id": body.id,
          "room_chatting.name": name,
          "room_chatting.img_url": imgUrl
        }
      });
    }
    else {
      const response = {
        "text": body.error.message
      };
      sendResponse(userData.sender_psid, response);
    }
  });
}

function sendNewPersonaMessage(list_users, message, userData, adminAction) {
  list_users.forEach((userPsid) => {
    if(userPsid !== userData.sender_psid) sendPersonaMessage(userPsid, message, userData.room_chatting.persona_id, adminAction);
  });
}

function sendPersonaMessage(sender_psid, message, persona_id, adminAction) {
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": message
  }
  if(adminAction === undefined) request_body.persona_id = persona_id;
  request({
    "uri": "https://graph.facebook.com/v6.0/me/messages",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if(err) {
      console.error("Unable to send message:" + err);
    } else {
      console.log(`+ successfully sent persona message \n=================================`);
    }
  });
}
