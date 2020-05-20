const request = require('request');
const sendResponse = require('../general/sendResponse');
const templateResponse = require('../general/templateResponse');
const textResponse = require('../general/textResponse');
const { extractHostname } = require('../general/validate-input');

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
  leaveRoom: leaveRoom
}

async function handleMessage(client, text, userData, attachment_url) {
  if(userData.room_chatting.has_joined) {
    const room_id = userData.room_chatting.room_id;
    client.db(dbName).collection('room-chatting').findOne({ room_id: room_id }, (err, res) => {
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
    // SUBROOM
    if(type === "subRoom") {
      if(!userData.room_chatting.create_new_subroom) {
        const limitUsers = text.split(" ")[0];
        if(!isNaN(limitUsers) && limitUsers <= 6) { // max members = 6
          client.db(dbName).collection('room-chatting').findOne({
            list_users: {
              $gt: 0
            },
            $where: `this.list_users.length < ${limitUsers} && this.room_id != 1`
          }, (err, res) => {
            if(err) console.log(err);
            else if(res) {
              setRoomID(client, res.room_id, userData);
              const message = {
                "text": `${userData.room_chatting.name.toUpperCase()} đã vào phòng chat!`
              };
              sendNewPersonaMessage(res.list_users, message, userData);
            }
            else {
              const response = "Không tìm thấy phòng. Hãy thử lại hoặc tạo phòng chat mới...";
              sendResponse(userData.sender_psid, response);
            }
          });
        }
        else {
          const response = {
            "text": "Giới hạn người không hợp lệ, hãy nhập lại..."
          };
          sendResponse(userData.sender_psid, response);
        }
      }
      else {
        const limitUsers = text.split(" ")[0];
        if(!isNaN(limitUsers) && limitUsers <= 6) { // max members = 6
          const room_id = await client.db(dbName).collection('room-chatting').countDocuments() + 1;
          client.db(dbName).collection('room-chatting').insertOne({
            room_id: room_id,
            list_users: [userData.sender_psid],
            limit_users: limitUsers
          }, (err, res) => {
            if(err) console.log(err);
            else {
              console.log(res.ops);
              setRoomID(client, res.ops[0].room_id, userData);
              const response = {
                "text": `Tạo phòng thành công! ID phòng của bạn là ${res.ops[0].room_id}.\nTớ sẽ thông báo khi có người vào phòng nhé!`
              };
              sendResponse(userData.sender_psid, response);
            }
          });
        }
        else {
          const response = {
            "text": "Giới hạn người không hợp lệ, hãy nhập lại..."
          };
          sendResponse(userData.sender_psid, response);
        }
      }
    }
    // SELECT ROOM
    else if(type === "selectRoom") {
      client.db(dbName).collection('room-chatting').findOne({ room_id: Number(text) }, (err, res) => {
        let response = {
          "text": ""
        }
        if(err) console.log(err);
        else if(!res) {
          response.text = "Không tìm thấy phòng.\nHãy nhập lại số phòng...";
          sendResponse(userData.sender_psid, response);
        }
        else if(res.list_users.length >= res.limit_users) {
          response.text = `Phòng đã đủ người, hãy vào lại sau...`;
          sendResponse(userData.sender_psid, response);
        }
        else {
          response.text = `Đã vào phòng chat ${res.room_id}.\nPhòng hiện có ${res.list_users.length} người, hãy chào mọi người đi :3`;
          sendResponse(userData.sender_psid, response);
          // send announcement for people in room
          const message = {
            "text": `${userData.room_chatting.name.toUpperCase()} đã vào phòng chat!`
          };
          sendNewPersonaMessage(res.list_users, message, userData);
          setRoomID(client, res.room_id, userData);
        }
      });
    }
  }
}

function joinGeneralRoom(client, userData) {
  initBlock(client, "generalRoom", userData);
  setRoomID(client, 1, userData);
  let response = {
    "text": ""
  };
  // get room 01 (general room)
  client.db(dbName).collection('room-chatting').findOne({ room_id: 1 }, (err, res) => {
    const totalMembers = res.list_users.length;
    if(totalMembers === 0) {
      response.text = "Trong phòng hiện không có người nào... Tớ sẽ thông báo khi có người vào phòng nhé!";
      sendResponse(userData.sender_psid, response);
    }
    else {
      response.text = `Đã vào phòng chat tổng...\nPhòng hiện có ${totalMembers} người, hãy chào mọi người đi :3`;
      sendResponse(userData.sender_psid, response);
      // send announcement for people in room
      const message = {
        "text": `${userData.room_chatting.name.toUpperCase()} đã vào phòng chat!`
      };
      sendNewPersonaMessage(res.list_users, message, userData);
    }
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
    "text": "Nhập ID phòng bạn muốn vào..."
  };
  sendResponse(userData.sender_psid, response);
}

function settingName(client, sender_psid) {

}

function settingAvatar(client, sender_psid) {

}

function createNewSubRoom(client, userData, limit_users) {

  client.db(dbName).collection('room-chatting').insertOne({
    "room_id": client.db(dbName).collection('room-chatting').count() + 1,
    "list_users": [userData.sender_psid],
    "limit_users": limit_users
  }, (err) => {
    if(err) console.log(err);
    else {
      const response = {
        "text": `Đã tạo phòng. ID phòng của bạn là ${client.db(dbName).collection('room-chatting').count()}. Tớ sẽ thông báo khi có người vào phòng nhé`
      }
      sendResponse(userData.sender_psid, response);
    }
  });
}

function createSubRoom(client, userData) {
  initBlock(client, "subRoom", userData, true);
  const response = textResponse.createSubRoomResponse;
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
      setRoomID(client, res.room_id, userData);
      const message = {
        "text": `${userData.room_chatting.name.toUpperCase()} đã vào phòng chat!`
      };
      const response = {
        "text": `Đã vào phòng chat ${res.room_id}.\nPhòng hiện có ${res.list_users.length} người, hãy chào mọi người đi :3`
      };
      //
      sendResponse(userData.sender_psid, response);
      sendNewPersonaMessage(res.list_users, message, userData);
    }
    else {
      const response = {
        "text": "Không tìm thấy phòng. Hãy tạo phòng mới và chờ, tớ sẽ thông báo cho bạn khi có người vào phòng nhé :>"
      };
      sendResponse(userData.sender_psid, response);
    }
  })
}

async function leaveRoom(client, userData) {
  // remove user from current room
  await client.db(dbName).collection('room-chatting').findOne({ room_id: userData.room_chatting.room_id }, async (err, roomData) => {
    if(err) console.log(err);
    else {
      const response = {
        "text": "Đã rời khỏi nhóm..."
      };
      sendResponse(userData.sender_psid, response);

      const message = {
        "text": `${userData.room_chatting.name} đã rời khỏi nhóm...`
      };
      sendNewPersonaMessage(roomData.list_users, message, userData);

      while(roomData.list_users.includes(userData.sender_psid)) {
        await client.db(dbName).collection('room-chatting').updateOne({ room_id: userData.room_chatting.room_id }, {
          $pull: {
            list_users: userData.sender_psid
          }
        });
        roomData = await client.db(dbName).collection('room-chatting').findOne({ room_id: userData.room_chatting.room_id });
      }
    }
  });
  // set all attributes of user's data to default
  while(userData.room_chatting.block) {
    await client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
      $set: {
        "room_chatting.block": false,
        "room_chatting.type": "",
        "room_chatting.has_joined": false,
        "room_chatting.room_id": ""
      }
    });
    userData = await client.db(dbName).collection('users-data').findOne({ sender_psid: userData.sender_psid });
  }
}

async function initBlock(client, type, userData, createSubRoom) {
  while(!userData.room_chatting.block) {
    await client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
      $set: {
        "room_chatting.block": true,
        "room_chatting.type": type,
        "room_chatting.create_new_subroom": createSubRoom === undefined ? false : true
      }
    });
    userData = await client.db(dbName).collection('users-data').findOne({ sender_psid: userData.sender_psid });
  }
}

async function setRoomID(client, room_id, userData) {
  while(!userData.room_chatting.has_joined) {
    await client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
      $set: {
        "room_chatting.block": true,
        "room_chatting.has_joined": true,
        "room_chatting.room_id": room_id
      }
    });
    userData = await client.db(dbName).collection('users-data').findOne({ sender_psid: userData.sender_psid });
  }
  let roomData = await client.db(dbName).collection('room-chatting').findOne({ room_id: room_id });
  while(!roomData.list_users.includes(userData.sender_psid)) {
    await client.db(dbName).collection('room-chatting').updateOne({ room_id: room_id }, {
      $push: {
        list_users: userData.sender_psid
      }
    });
    roomData = await client.db(dbName).collection('room-chatting').findOne({ room_id: room_id });
  }
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

function sendNewPersonaMessage(list_users, message, userData) {
  list_users.forEach((userPsid) => {
    sendPersonaMessage(userPsid, message, userData.room_chatting.persona_id);
  });
}

function sendPersonaMessage(sender_psid, message, persona_id) {
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": message,
    "persona_id": persona_id
  }
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
