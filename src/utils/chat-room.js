const request = require('request');
const sendResponse = require('../general/sendResponse');
const templateResponse = require('../general/templateResponse');
const textResponse = require('../general/textResponse');
const { extractExtName, extractHostname } = require('../general/validate-input');
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
  roomInfo: roomInfo,
  getPersonaID: getPersonaID
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
        if(attachment_url) message = returnMessageBelongWithExtName(attachment_url);
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
         if(!userData.room_chatting.create_new_subroom) findValidRoom(client, userData, limitUsers);
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
    else {
      initBlock(client, "subRoom", userData);
      sendAnnouncement(client, userData, res);
    }
  });
}

function findValidRoom(client, userData, limitUsers) {
  let response = {
    "text": ""
  };
  client.db(dbName).collection('room-chatting').find({
    "limit_users": Number(limitUsers),
    "list_users.0": {
      $exists: true
    },
    "room_id": {
      $gt: 1
    }
  }).toArray((err, res) => {
    if(err) console.log(err);
    else if(res.length != 0) {
      let validRoom = [];
      res.forEach((room) => {
        if(room.list_users.length < Number(room.limit_users)) validRoom.push(room);
      });
      if(validRoom.length != 0) sendAnnouncement(client, userData, validRoom[Math.floor(Math.random() * validRoom.length)]);
      else {
        response = textResponse.subRoomResponse;
        response.text = "Không tìm thấy phòng trống hoặc có người. Hãy tìm phòng khác hoặc tạo phòng mới...";
        sendResponse(userData.sender_psid, response);
      }
    }
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
  let response = textResponse.subRoomResponse;
  response.text = "Bạn muốn tham gia phòng bao nhiêu người?";
  return response;
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
  const response = templateResponse.chatRoomFindImages;
  sendResponse(userData.sender_psid, response);
}

function sendAnnouncement(client, userData, room) {
  const response = {
    "text": `Đã vào phòng chat ${room.room_id}.\n${room.list_users.length} người đang chờ tin nhắn từ bạn, hãy chào mọi người đi :3
* Nhập Menu để xem thông tin phòng và thông tin cá nhân
* Nhập Exit để thoát phòng và sử dụng các tính năng khác`,
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Menu",
        "payload": "menu",
        "image_url": ""
      },
      {
        "content_type": "text",
        "title": "Exit",
        "payload": "exit",
        "image_url": ""
      }
    ]
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
    limit_users: Number(limitUsers)
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
  client.db(dbName).collection('room-chatting').find({
    room_id: {
      $gt: 1
    },
    "list_users.0": {
      $exists: true
    },
  }).toArray((err, res) => {
    if(err) console.log(err);
    else if(res.length != 0) {
      initBlock(client, "subRoom", userData);
      let validRoom = [];
      res.forEach((room) => {
        if(room.list_users.length < Number(room.limit_users)) validRoom.push(room);
      });
      if(validRoom.length != 0) sendAnnouncement(client, userData, validRoom[Math.floor(Math.random() * validRoom.length)]);
      else {
        const response = {
          "text": "Không tìm thấy phòng trống hoặc có người. Hãy tạo phòng mới và chờ, tớ sẽ thông báo cho bạn khi có người vào phòng nhé :>"
        };
        sendResponse(userData.sender_psid, response);
        client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
          $set: userDataUnblockSchema(userData)
        });
      }
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
    room_id: userData.room_chatting.pre_room
  }, (err, room) => {
    if(err) console.log(err);
    else if(room.limit_users > room.list_users.length) {
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
  // leave current room
  client.db(dbName).collection('room-chatting').findOneAndUpdate({
    room_id: userData.room_chatting.room_id
    ? userData.room_chatting.room_id
    : userData.room_chatting.pre_room
  }, {
    $pull: {
      list_users: userData.sender_psid
    }
  }, (err, roomData) => {
    if(err) console.log(err);
    else {
      const response = textResponse.defaultResponse;
      response.text = "Đã rời khỏi phòng...";
      sendResponse(userData.sender_psid, response);
      // send announcement to users in current room
      const message = {
        "text": `${userData.room_chatting.name.toUpperCase()} đã rời khỏi phòng...`
      };
      sendNewPersonaMessage(roomData.value.list_users, message, userData, 1);
    }
  });
  // set all attributes of user's data to default
  let update = userDataUnblockSchema(userData);
  update.room_chatting.pre_room = userData.room_chatting.room_id;
  client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
    $set: update
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

function returnMessageBelongWithExtName(url) {
  const imgFileFormats = ['tif', 'tiff', 'jpg', 'jpeg', 'gif', 'png'];
  const vidFileFormats = ['webm', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'mp4', 'm4p', 'm4v', 'avi', 'wmv', 'mov', 'qt'];
  console.log(url);
  // Forming message
  let message = templateResponse.sendAttachment;
  message.attachment.payload.url = url;
  // process extName
  const hostName = extractHostname(url);
  console.log(hostName);
  // return right text response belong with each extName & hostname
  if(hostName === "scontent.xx.fbcdn.net") message.attachment.type = "image";
  else if(hostName === "video.xx.fbcdn.net") message.attachment.type = "video";
  else if(hostName === "cdn.fbsbx.com") {
    const extName = extractExtName(url);
    if(extName === "gif") message.attachment.type = "image";
    else if(extName === "mp4") message.attachment.type = "audio";
    else message.attachment.type = "file";
  }
  else if(hostName === 'l.facebook.com') {
    message = templateResponse.personaSendLocation;
    message.attachment.payload.text = "Đã gửi vị trí";
    message.attachment.payload.buttons[0].url = url;
    message.attachment.payload.buttons[0].title = "Xem";
  }
  else message.attachment.type = "file";
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
      let update = userDataUnblockSchema(userData);
      update.room_chatting.block = false;
      update.room_chatting.type = "";
      update.room_chatting.persona_id = body.id;
      update.room_chatting.name = name;
      update.room_chatting.img_url = imgUrl;
      client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
        $set: update
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
