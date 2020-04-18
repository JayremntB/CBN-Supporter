(async function () {
'use strict'
// node_modules
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const { MongoClient } = require('mongodb');
// features
const calcSAWTime = require('./src/utils/calc-saw-time');
const showChatbotInfor = require('./src/utils/chatbot-infor');
const checkCovid = require('./src/utils/check-covid');
const searchSchedule = require('./src/utils/search-schedule');
const getStarted = require('./src/utils/get-started');
const setting = require('./src/utils/setting');
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
app.post('/webhook', async (req, res) => {
  let body = req.body;
  if(body.object === 'page') {
    body.entry.forEach(function (entry) {
      // Get "body" of webhook event
      let webhook_event = entry.messaging[0];
      console.log("RECEIVED  A  MESSAGE");
      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log("From: " + sender_psid);
      // check if the webhook_event is a normal message
      // or a Postback message
      if(webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if(webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

async function handleMessage(sender_psid, received_message) {
  let response = {
    "text": "Tìm tính năng cậu cần ở phần Menu nha <3"
  };
  if(received_message.text) {
    const userData = await client.db(dbName).collection(collectionName).findOne({ sender_psid: sender_psid });
    console.log(userData);
    const text = received_message.text;
    const textSplit = text.split(" ");
    console.log("message: " + text + "\n---------------------------------");
    if(textSplit[0].toLowerCase() === 'setclass') {
      setting.handleMessage(client, sender_psid, textSplit[1].toLowerCase());
    }
    if(text === 'Exit') {
      response.text = "Đã trở lại chat với Jay :>";
      sendResponse(sender_psid, response);
      unblockAll(sender_psid);
    }
    else if(userData.search_schedule_block) {
      searchSchedule.handleMessage(client, sender_psid, text, userData);
    }
    else if(userData.search_classes.block) {

    }
    else if(userData.search_subject.block) {

    }
    else if(userData.setting_block) {

    }
  }
  else if(received_message.attachments) {
      console.log("Received attachment");
      sendResponse(sender_psid, response);
  }
}

function handlePostback(sender_psid, received_postback) {
  let response = {
    "text": "Tính năng này hiện không khả dụng do dev đang lười và chưa có ny T.T"
  };
  // Get the payload of receive postback
  let payload = received_postback.payload;
  console.log('postback: ' + payload + "\n---------------------------------");
  // Set response based on payload
  switch (payload) {
    case "getStarted":
      getStarted(client, sender_psid);
      break;
    case "searchSchedule":
      unblockAll(sender_psid);
      searchSchedule.handlePostback(client, sender_psid);
      break;
    case "searchSubject":
    case "searchClasses":
      sendResponse(sender_psid, response);
      break;
    case "sawTime":
      calcSAWTime(sender_psid);
      break;
    case "checkCovid":
      checkCovid(sender_psid);
      break;
    case "chatbotInformation":
      showChatbotInfor(sender_psid);
      break;
    case "setting":
      unblockAll(sender_psid);
      setting.handlePostback(sender_psid);
      break;
    default:
      response.text = "Tìm tính năng cậu cần ở phần Menu nha <3";
      sendResponse(sender_psid, response);
  }
}

function unblockAll(sender_psid) {
  client.db(dbName).collection('users-data').updateOne({ sender_psid: sender_psid }, {
    $set: {
      setting_block: false,
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
