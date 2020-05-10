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
// general
const sendResponse = require('./src/general/sendResponse');
const stuff = require('./src/general/stuff');
const port = (process.env.PORT) || 5000;
const app = express().use(bodyParser.json());
// prepare
app.listen(port, () => {
  console.log('webhook is listening on port ' + port);
});
const connectionUrl = process.env.DATABASE_URI;
// const connectionUrl = "mongodb://127.0.0.1:27017";
const dbName = 'database-for-cbner';
const collectionName = 'users-data';
const listUnblockCommands = ['menu', 'lệnh', 'hd', 'help', 'ngủ', 'dậy', 'tkb', 'dạy', 'covid', 'lop', 'xemlop', 'xoalop', 'gv', 'xemgv', 'xoagv', 'wd', 'xemwd', 'xoawd'];
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
      console.log("From: " + sender_psid);
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
  let response = stuff.defaultResponse;
  if(received_message.text) {
    const textNotLowerCase = received_message.text;
    let text = received_message.text.toLowerCase();
    const textSplit = textNotLowerCase.split(" ");
    textSplit[0] = textSplit[0].toLowerCase();
    console.log("message: " + text + "\n--------------------------------");
    //
    if(text === 'exit') {
      unblockAll(sender_psid);
      response = stuff.exitResponse;
      sendResponse(sender_psid, response);
    }
    else if(listNonUnblockCommands.includes(text)) {
      if(userData.live_chat) {
        liveChat.deniedUsingOtherFeatures(sender_psid);
      }
      else {
        switch (text) {
          case 'danh sách lớp':
          case 'dsl':
            response = stuff.groupList;
            sendResponse(sender_psid, response);
            break;
          case 'danh sách giáo viên':
          case 'dsgv':
            response = stuff.teacherList;
            sendResponse(sender_psid, response);
            break;
          case 'đặt lớp mặc định':
            response = stuff.recommendedSetGroup;
            sendResponse(sender_psid, response);
            break;
          case 'đặt gv mặc định':
            response = stuff.recommendedSetTeacher;
            sendResponse(sender_psid, response);
            break;
          case 'đổi thời gian tb':
            response = stuff.recommendedSetWindDown;
            sendResponse(sender_psid, response);
            break;
        }
      }
    }
    else if(listUnblockCommands.includes(textSplit[0])) {
      if(userData.live_chat) {
        liveChat.deniedUsingOtherFeatures(sender_psid);
      }
      else {
        unblockAll(sender_psid);
        switch (textSplit[0]) {
          case 'lệnh':
            response.text = `${stuff.listGeneralCommands.text}\n${stuff.listInitFeatureCommands.text}\n${stuff.listSettingCommands.text}`;
            sendResponse(sender_psid, response);
            break;
          case 'help':
            liveChat.startLiveChat(client, sender_psid);
            break;
          case 'hd':
            response.text = "https://github.com/JayremntB/CBN-Supporter-How-to-use/blob/master/README.md";
            sendResponse(sender_psid, response);
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
      searchClasses.handleMessage(client, sender_psid, textNotLowerCase, userData);
    }
  }
}

function handlePostback(sender_psid, received_postback, userData) {
  // Get the payload of receive postback
  let text = JSON.parse(received_postback.payload).__button_text__.toLowerCase();
  const textSplit = text.split(" ");
  console.log('postback: ' + text + "\n---------------------------------");
  // Set response based on payload
  let response;
  unblockAll(sender_psid);
  switch (text) {
    case 'tra thời khoá biểu':
      searchSchedule.init(client, sender_psid, userData);
      break;
    case 'tra lịch dạy':
      searchClasses.init(client, sender_psid, userData);
      break;
    case 'tính giờ dậy':
      calcWakeUpTime(sender_psid);
      break;
    case 'tình hình covid-19':
      checkCovid(sender_psid);
      break;
    case 'hỗ trợ':
      liveChat.startLiveChat(client, sender_psid);
      break;
    case 'chung':
      response = stuff.listGeneralCommands;
      sendResponse(sender_psid, response);
      break;
    case 'kích hoạt tính năng':
      response = stuff.listInitFeatureCommands;
      sendResponse(sender_psid, response);
      break;
    case 'cài đặt và đi kèm':
      response = stuff.listSettingCommands;
      sendResponse(sender_psid, response);
      break;
  }
}

function initUserData(sender_psid) {
  const insert = {
    sender_psid: sender_psid,
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
    search_groups: {
      block: false,
      subject: "",
      day: "",
      time: ""
    },
    live_chat: false
  };
  client.db(dbName).collection(collectionName).insertOne(insert);
  return insert;
}

function unblockAll(sender_psid) {
  client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
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
      search_groups: {
        block: false,
        subject: "",
        day: "",
        time: ""
      },
      live_chat: false
    }
  });
}
})();
