const request = require('request');
const sendResponse = require('../general/sendResponse');

const dbName = 'database-for-cbner';
module.exports = {
  handleMessage: handleMessage,
  joinGeneralRoom: joinGeneralRoom,
  joinSubRoom: joinSubRoom,
  selectRoom: selectRoom,
  settingName: settingName,
  settingAvatar: settingAvatar,
  createSubRoom: createSubRoom,
  joinRandomRoom: joinRandomRoom
}

function handleMessage(client, text, userData) {
  if(userData.room_chatting.has_joined) {
    const room_id = userData.room_chatting.room_id;
    client.db(dbName).collection('room_chatting').findOne({ room_id: room_id }, (err, res) => {
      if(err) console.log(err);
      else {
        const message = {
          "text": `${userData.room_chatting.name.toUpperCase()} đã vào phòng chat!`
        };
        sendNewPersonaMessage(res.list_users, text, userData);
      }
    });
  }
  else {
    const type = userData.room_chatting.type;
    // NOT have generalRoom type cause if there had, it would already have "has_joined" attribute = true
    if(type === "subRoom") {
      const totalMembers = text.split(" ")[0];
      if(!NaN(totalMembers) && totalMembers <= 6) { // max members = 6
        client.db(dbName).collection('room_chatting').findOne({
          list_users: {
            $gt: 0
          },
          $where: {
            `this.list_users.length < ${totalMembers}`
          }
        }, (err, res) => {
          if(err) console.log(err);
          else if(res) {
            setRoomID(res.room_id, userData);
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
    }
    else if(type === "selectRoom") {
      client.db(dbName).collection('room-chatting').findOne({ room_id: text }, (err, res) => {
        let response = {
          "text": ""
        }
        if(err) console.log(err);
        else if(!res) {
          response.text = "Không tìm thấy phòng.\nHãy nhập lại số phòng...";
          sendResponse(userData.sender_psid, response);
        }
        else if(res.list_users.length === res.limit_users) {
          response.text = `Phòng đã đủ người, hãy vào lại sau...`;
          sendResponse(userData.sender_psid, response);
        }
        else {
          response.text = `Đã vào phòng chat ${res.room_id}. Phòng hiện có ${res.list_users.length}, hãy chào mọi người đi :3`;
          sendResponse(userData.sender_psid, response);
          // send announcement for people in room
          const message = {
            "text": `${userData.room_chatting.name.toUpperCase()} đã vào phòng chat!`
          };
          sendNewPersonaMessage(res.list_users, message, userData);
          setRoomID(res.room_id, userData);
        }
      });
    }
  }
}

function joinGeneralRoom(client, userData) {
  initBlock("generalRoom", userData);
  setRoomID(1, userData);
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
      sendNewPersonaMessage(res.list_users, message, userData);
    }
  });
}

function joinSubRoom(client, userData) {
  initBlock("subRoom", userData);
  const response = templateResponse.subRoomResponse;
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

function createNewSubRoom(client, userData, limit_users) {
  client.db(dbName).collection('room-chatting').insertOne({
    "room_id": client.db(dbName).collection('room-chatting').count() + 1;
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
  initBlock("subRoom", userData);
  const response = templateResponse.subRoomResponse;
  sendResponse(userData.sender_psid, response);
}

function joinRandomRoom(client, userData) {
  client.db(dbName).collection('room-chatting').findOne({
    room_id: {
      $gt: 1
    },
    $where: "this.list_users.length > 0"
  }, (err, res) => {
    if(err) console.log(err);
    else {
      setRoomID(res.room_id, userData);
      const message = {
        "text": `${userData.room_chatting.name.toUpperCase()} đã vào phòng chat!`
      };
      sendNewPersonaMessage(res.list_users, message, userData);
    }
  })
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
  while(!userData.room_chatting.has_joined) {
    client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
      $set: {
        room_chatting.has_joined: true,
        room_chatting.room_id: room_id
      }
    });
    userData = client.db(dbName).collection('user-data').findOne({ sender_psid: userData.sender_psid });
  }
  while(!client.db(dbName).collection('room_chatting').findOne({ room_id: room_id }).list_users.include(userData.sender_psid)) {
    client.db(dbName).collection('users-data').updateOne({ room_id: room_id }, {
      $push: {
        list_users: userData.sender_psid
      }
    });
  }
}

function sendNewPersonaMessage(list_users, message, userData) {
  list_users.forEach((userPsid) => {
    if(userPsid !== userData.sender_psid) sendPersonaMessage(userPsid, message, userData.room_chatting.persona_id);
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
