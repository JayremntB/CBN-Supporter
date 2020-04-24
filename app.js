(async function () {
'use strict'
// node_modules
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const { MongoClient } = require('mongodb');
// features
const setting = require('./src/utils/setting');
const calcWakeUpTime = require('./src/utils/calc-wake-up-time');
const checkCovid = require('./src/utils/check-covid');
const searchSchedule = require('./src/utils/search-schedule');
const searchClasses = require('./src/utils/search-classes');
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
const client = await MongoClient.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.send("ok");
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
      // check if the webhook_event is a normal message
      // or a Postback message
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
  let response = {
    "text": ""
  };
  if(received_message.text) {
    const textNotLowerCase = received_message.text;
    const text = received_message.text.toLowerCase();
    const textSplit = text.split(" ");
    console.log("message: " + text + "\n---------------------------------");

    if(text === 'exit' || text === 'menu' || text === 'help') unblockAll(sender_psid);
    else if(text === 'danh sách lớp') {
      response = stuff.groupList;
      sendResponse(sender_psid, response);
    }
    else if(text === 'danh sách giáo viên') {
      response = stuff.teacherList;
      sendResponse(sender_psid, response);
    }
    else if(textSplit[0] === 'setclass' || textSplit[0] === 'viewclass' || textSplit[0] === 'delclass') {
      unblockAll(sender_psid);
      setting.handleMessage(client, sender_psid, textSplit, userData);
    }
    else if(userData.search_schedule_block || userData.search_classes.block || userData.search_subject.block) {
      if(userData.search_schedule_block) {
        searchSchedule.handleMessage(client, sender_psid, text, userData);
      }
      else if(userData.search_classes.block) {
        searchClasses.handleMessage(client, sender_psid, textNotLowerCase, userData);
      }
      else if(userData.search_subject.block) {

      }
    }
    else {
      unblockAll(sender_psid);
      switch (text) {
        case 'tìm môn học':
        case 'tính giờ ngủ':
          break;
        case 'tra thời khoá biểu':
          searchSchedule.init(client, sender_psid, userData);
          break;
        case 'tìm tiết dạy':
          searchClasses.init(client, sender_psid);
          break;
        case 'tình hình covid-19':
          checkCovid(sender_psid);
          break;
        case 'tính giờ dậy':
          calcWakeUpTime(sender_psid);
          break;
        default:
      }
    }
  }
}

function handlePostback(sender_psid, received_postback, userData) {
  let response = {
    "text": "Tính năng này hiện không khả dụng do thằng coder đang lười và chưa có ny T.T"
  };
  // Get the payload of receive postback
  let text = JSON.parse(received_postback.payload).__button_text__.toLowerCase();
  const textSplit = text.split(" ");
  console.log('postback: ' + text + "\n---------------------------------");
  // Set response based on payload
  unblockAll(sender_psid);
  switch (text) {
    case 'menu':
    case 'tính năng chính':
    case 'các tính năng khác':
    case 'tìm môn học':
    case 'tính giờ ngủ':
    case 'thông tin chatbot':
    case 'góp, gợi ý tính năng':
    case 'cài đặt':
      break;
    case 'tra thời khoá biểu':
      searchSchedule.init(client, sender_psid, userData);
      break;
    case 'tìm tiết dạy':
      searchClasses.init(client, sender_psid);
      break;
    case 'tính giờ dậy':
      calcWakeUpTime(sender_psid);
      break;
    case 'tình hình covid-19':
      checkCovid(sender_psid);
      break;
  }
}

function initUserData(sender_psid) {
  const insert = {
    sender_psid: sender_psid,
    group: "",
    main_schedule: [],
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
    },
    platform: ""
  };
  client.db(dbName).collection(collectionName).insertOne(insert);
  return insert;
}

function unblockAll(sender_psid) {
  client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
    $set: {
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
    }
  });
}
})();
