(async function () {
'use strict'
// node_modules
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const { MongoClient } = require('mongodb');
// features
const setting = require('./src/utils/setting');
const estimateWakeUpTime = require('./src/utils/estimate-wake-up-time');
const estimateSleepTime = require('./src/utils/estimate-sleep-time');
const checkCovid = require('./src/utils/check-covid');
const searchSchedule = require('./src/utils/search-schedule');
const searchClasses = require('./src/utils/search-classes');
const liveChat = require('./src/utils/live-chat');
const chatRoom = require('./src/utils/chat-room');
// general
const sendResponse = require('./src/general/sendResponse');
const textResponse = require('./src/general/textResponse');
const templateResponse = require('./src/general/templateResponse');
const port = (process.env.PORT) || 5000;
const app = express().use(bodyParser.json());
// prepare
app.listen(port, () => {
  console.log('webhook is listening on port ' + port);
});
// const connectionUrl = process.env.DATABASE_URI;
const connectionUrl = "mongodb://127.0.0.1:27017";
const dbName = 'database-for-cbner';
const collectionName = 'users-data';
const listUnblockCommands = ['menu', 'lệnh', 'hd', 'help', 'ngủ', 'dậy', 'tkb', 'dạy', 'lop', 'xemlop', 'xoalop', 'gv', 'xemgv', 'xoagv', 'wd', 'xemwd', 'xoawd'];
const listNonUnblockCommands = ['danh sách lớp', 'dsl', 'danh sách giáo viên', 'dsgv', 'đặt lớp mặc định', 'đặt gv mặc định', 'đổi thời gian tb'];
const client = await MongoClient.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true });
//
app.get('/', (req, res) => {
  res.send("deployed successfully");
});

app.get('/webhook', (req, res) => {
  let mode = req.query['hub.mode'];
  let challenge = req.query['hub.challenge'];
  let token = req.query['hub.verify_token'];

  if(mode && token) {
    if(mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.send("Wrong token");
    }
  }
});

// Received messages
app.post('/webhook', (req, res) => {
  let body = req.body;
  if(body.object === 'page') {
    body.entry.forEach(async (entry) => {
      // Get "body" of webhook event
      let webhook_event = entry.messaging[0];
      console.log("RECEIVED  A  MESSAGE");
      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      // check if the webhook_event is a normal message or a Postback message
      let userData = await client.db(dbName).collection(collectionName).findOne({ sender_psid: sender_psid });
      if(!userData) userData = initUserData(sender_psid);
      if(webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message, userData);
      }
      else if(webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback, userData);
      }
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

function handleMessage(sender_psid, received_message, userData) {
  // setTimeout(() => {
  //   const response = {
  //     "text": "test1"
  //   };
  //   sendResponse(sender_psid, response);
  //   console.log("ok");
  // }, 1000 * 60);
  let response = {
    "text": ""
  };
  if(received_message.text) {
    const defaultText = received_message.text;
    let text = received_message.text.toLowerCase();
    const textSplit = defaultText.split(" ");
    textSplit[0] = textSplit[0].toLowerCase();
    console.log("message: " + text + "\n--------------------------------");
    //
    if(userData.room_chatting.block) {
      if(text === 'exit' && userData.room_chatting.has_joined) chatRoom.leaveRoom(client, userData);
      else if(text === 'exit') {
        unblockAll(userData);
        response = textResponse.exitResponse;
      }
      else chatRoom.handleMessage(client, defaultText, userData);
    }
    else if(text === 'exit') {
      unblockAll(userData);
      response = textResponse.exitResponse;
    }
    else if(listNonUnblockCommands.includes(text)) {
      if(userData.live_chat) {
        liveChat.deniedUsingOtherFeatures(sender_psid);
      }
      else {
        switch (text) {
          case 'danh sách lớp':
          case 'dsl':
            response = textResponse.groupList;
            break;
          case 'danh sách giáo viên':
          case 'dsgv':
            response = textResponse.teacherList;
            break;
          case 'đặt lớp mặc định':
            response = textResponse.recommendedSetGroup;
            break;
          case 'đặt gv mặc định':
            response = textResponse.recommendedSetTeacher;
            break;
          case 'đổi thời gian tb':
            response = textResponse.recommendedSetWindDown;
            break;
        }
      }
    }
    else if(listUnblockCommands.includes(textSplit[0])) {
      if(userData.live_chat) {
        liveChat.deniedUsingOtherFeatures(sender_psid);
      }
      else {
        unblockAll(userData);
        switch (textSplit[0]) {
          case 'menu':
            response = templateResponse.menu;
            break;
          case 'lệnh':
            response = textResponse.defaultResponse;
            response.text = `${textResponse.listGeneralCommands.text}\n${textResponse.listInitFeatureCommands.text}\n${textResponse.listSettingCommands.text}`;
            break;
          case 'help':
            liveChat.startLiveChat(client, sender_psid);
            break;
          case 'hd':
            response = textResponse.defaultResponse;
            response.text = "https://github.com/JayremntB/CBN-Supporter-How-to-use/blob/master/README.md";
            break;
          case 'lop':
          case 'xemlop':
          case 'xoalop':
            setting.handleSetGroupMessage(client, sender_psid, textSplit, userData);
            break;
          case 'gv':
          case 'xemgv':
          case 'xoagv':
            setting.handleSetTeacherMessage(client, sender_psid, textSplit, userData);
            break;
          case 'wd':
          case 'xemwd':
          case 'xoawd':
            setting.handleWindDownMessage(client, sender_psid, textSplit, userData);
            break;
          case 'tkb':
            searchSchedule.init(client, sender_psid, userData);
            break;
          case 'dạy':
            searchClasses.init(client, sender_psid, userData);
            break;
          case 'covid':
            checkCovid(sender_psid);
            break;
          case 'dậy':
            estimateSleepTime(sender_psid, textSplit, userData);
            break;
          case 'ngủ':
            estimateWakeUpTime(sender_psid, textSplit, userData);
            break;
        }
      }
    }
    else if(userData.search_schedule_block) {
      searchSchedule.handleMessage(client, sender_psid, text, userData);
    }
    else if(userData.search_classes_block) {
      searchClasses.handleMessage(client, sender_psid, defaultText, userData);
    }
  }
  else if(received_message.attachments) {
    // Gets the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    chatRoom.handleMessage(client, "", userData, attachment_url);
  }
  sendResponse(sender_psid, response);
}

async function handlePostback(sender_psid, received_postback, userData) {
  // Get the payload of receive postback
  let payload = received_postback.payload;
  let response = {
    "text": ""
  };
  console.log('postback: ' + payload + "\n---------------------------------");
  //
  if(userData.room_chatting.has_joined && userData.room_chatting.block) {
    switch (payload) {
      case 'menu':
        response = templateResponse.roomChattingMenu;
        break;
      case 'help':
        unblockAll(userData);
        chatRoom.leaveRoom(client, userData);
        liveChat.startLiveChat(client, sender_psid);
        break;
      case 'leaveRoom':
        chatRoom.leaveRoom(client, userData);
        break;
      case 'roomInfo':
        chatRoom.roomInfo(client, userData);
        break;
      case 'userInfo':
        chatRoom.userInfo(userData);
        break;
      case 'settingProfile':
        const response1 = {
          "text": "Đã thoát phòng để bảo vệ quyền riêng tư :<"
        };
        sendResponse(userData.sender_psid, response1);
        chatRoom.leaveRoom(client, userData);
        response = templateResponse.settingProfile;
        break;
      default:
        response.text = 'Thoát phòng để sử dụng các tính năng...'
    }
  }
  else if(userData.live_chat) {
    liveChat.deniedUsingOtherFeatures(sender_psid);
  }
  else {
    await unblockAll(userData);
    switch (payload) {
      // Menu possess
      case 'menu':
        response = templateResponse.menu;
        break;
      //
      case 'roomInfo':
      case 'leaveRoom':
        response.text = "Bạn hiện không ở trong phòng nào...";
        break;
      case 'userInfo':
        chatRoom.userInfo(userData);
        break;
      case 'searchFeatures':
        response = templateResponse.features;
        break;
        //
      case 'searchSchedule':
        searchSchedule.init(client, sender_psid, userData);
        break;
      case 'searchClasses':
        searchClasses.init(client, sender_psid, userData);
        break;
      //
      case 'otherFeatures':
        response = textResponse.otherFeaturesResponse;
        break;
      // chatRoom
      case 'chatRoom':
        response = templateResponse.chatRoom;
        break;
      //
      case 'joinChatRoom':
        response = templateResponse.joinChatRoom;
        break;
        //
      case 'generalRoom':
        chatRoom.joinGeneralRoom(client, userData);
        break;
      case 'subRoom':
        chatRoom.joinSubRoom(client, userData);
        break;
          //
      case 'createSubRoom':
        chatRoom.createSubRoom(client, userData);
        break;
      case 'randomSubRoom':
        chatRoom.joinRandomRoom(client, userData);
        //
        break;
      case 'selectRoom':
        chatRoom.selectRoom(client, userData);
        break;
      //
      case 'settingProfile':
        response = templateResponse.settingProfile;
        break;
        //
      case 'settingName':
        chatRoom.settingName(client, userData);
        break;
      case 'settingAvatar':
        chatRoom.settingAvatar(client, userData);
        break;
      // listCommands possess
      case 'listCommands':
        response = templateResponse.listCommands;
        break;
      //
      case 'generalCommands':
        response = textResponse.listGeneralCommands;
        break;
      case 'initFeatureCommands':
        response = textResponse.listInitFeatureCommands;
        break;
      case 'settingCommands':
        response = textResponse.listSettingCommands;
        break;
      // Information and help possess
      case 'chatbotInformation':
        response = textResponse.chatbotInformationResponse;
        break;
      case 'help':
        liveChat.startLiveChat(client, sender_psid);
        break;
    }
  }
  sendResponse(sender_psid, response);
}

function initUserData(sender_psid) {
  const insert = {
    sender_psid: sender_psid,
    persona_id: "249248646315258",
    group: "",
    teacher: "",
    wind_down_time: 14,
    main_schedule: [],
    main_teach_schedule: [],
    search_schedule_block: false,
    search_classes_block: false,
    search_schedule_other_group: {
      block: false,
      group: "",
      schedule: []
    },
    search_classes_other_teacher: {
      block: false,
      teacher: "",
      teaches: []
    },
    room_chatting: {
      block: false,
      has_joined: false,
      type: "",
      create_new_subroom: false,
      room_id: "",
      persona_id: "249248646315258",
      name: "Người lạ",
      img_url: "https://i.imgur.com/187Y4u3.png"
    },
    live_chat: false
  };
  client.db(dbName).collection(collectionName).insertOne(insert);
  return insert;
}

async function unblockAll(userData) {
  await client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
    $set: {
      main_schedule: [],
      main_teach_schedule: [],
      search_schedule_block: false,
      search_classes_block: false,
      search_schedule_other_group: {
        block: false,
        group: "",
        schedule: []
      },
      search_classes_other_teacher: {
        block: false,
        teacher: "",
        teaches: []
      },
      room_chatting: {
        block: false,
        has_joined: false,
        type: "",
        create_new_subroom: false,
        room_id: "",
        persona_id: userData.room_chatting.persona_id,
        name: userData.room_chatting.name,
        img_url: userData.room_chatting.img_url
      },
      live_chat: false
    }
  });
}
})();
