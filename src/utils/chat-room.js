const request = require('request');
const sendResponse = require('../general/sendResponse');

const dbName = 'database-for-cbner';
module.exports = {
  handleMessage: handleMessage,
  joinGeneralRoom: joinGeneralRoom,
  joinSubRoom: joinSubRoom,
  selectRoom: selectRoom,
  settingName: settingName,
  settingAvatar: settingAvatar
}

function handleMessage(client, text, userData) {
  if(userData.room_chatting.joined) {
    const room_id = userData.room_chatting.room_id;
    client.db(dbName).collection('room_chatting').findOne({ room_id: room_id }, (err, res) => {
      if(err) {
        const response = {
          "text": "Không tìm thấy phòng, vui lòng thử lại sau..."
        };
        sendResponse(userData.sender_psid, response);
      }
      else sendNewPersonaMessage(res.list_users, text, userData.room_chatting.persona_id);
    })
  }
  else {
    const type = userData.room_chatting.type;
    // NOT have generalRoom type cause if there had, it would already have "joined" attribute = true
    if(type === "subRoom") {

    }
    else if(type === "selectRoom") {

    }
  }
}

function joinGeneralRoom(client, userData) {
  initBlock("generalRoom", userData);
  setRoomID()
  let response = {
    "text": ""
  };
  // get room 01 (general room)
  client.db(dbName).collection('room-chatting').findOne({ room_id: "1" }, (res) => {
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
      sendNewPersonaMessage(res.list_users, message, userData.room_chatting.persona_id);
    }
  });
}

function joinSubRoom(client, userData) {
  initBlock("subRoom", userData);
  let response = textResponse.subRoomResponse;
  sendResponse(userData.sender_psid, response);
}

function selectRoom(client, userData) {
  initBlock("selectRoom", userData);
  let response = {
    "text": "Nhập ID phòng bạn muốn vào..."
  };
  sendResponse(userData.sender_psid, response);
}

function settingName(client, sender_psid) {

}

function settingAvatar(client, sender_psid) {

}

function initBlock(type, userData) {
  while(!userData.room_chatting.block) {
    client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
      $set: {
        room_chatting.block: true,
        room_chatting.type: type
      }
    });
    userData = client.db(dbName).collection('user-data').findOne({ sender_psid: userData.sender_psid });
  }
}

function setRoomID(room_id, userData) {
  while(!userData.room_chatting.joined) {
    client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
      $set: {
        room_chatting.joined: true,
        room_chatting.room_id: room_id
      }
    });
    userData = client.db(dbName).collection('user-data').findOne({ sender_psid: userData.sender_psid });
  }
}

function sendNewPersonaMessage(list_users, message, persona_id) {
  list_users.forEach((userPsid) => {
    sendPersonaMessage(userPsid, message, persona_id);
  });
}

function sendPersonaMessage(sender_psid, message, persona_id) {
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "messaging_type": "RESPONSE",
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
