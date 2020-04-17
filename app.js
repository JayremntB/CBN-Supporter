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
// common
const sendResponse = require('./src/common/sendResponse');
const stuff = require('./src/common/stuff');
const port = (process.env.PORT) || 5000;
const app = express().use(bodyParser.json());
// prepare
app.listen(port, () => {
  console.log('webhook is listening on port ' + port);
});
const connectionUrl = process.env.DATABASE_URI;
const dbName = 'database-for-cbner';
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
    const text = received_message.text;
    console.log("message: " + text + "\n---------------------------------");
    if(text === 'Exit') {
      response.text = "Đã trở lại chat với Jay :>";
      sendResponse(sender_psid, response);
      searchSchedule.deleteData(client, sender_psid);
    } else {
      if(client.isConnected()) {
        if(text === "Ghi lại lớp") {
          response = stuff.searchScheduleAskGroup;
          sendResponse(sender_psid, response);
          searchSchedule.clearGroupAndSchedule(client, sender_psid);
        } else {
          const userSearchScheduleData = await searchSchedule.getData(client, sender_psid);
          // search schedule request
          if(userSearchScheduleData) {
            if(!userSearchScheduleData.group) {
              if(checkGroup(sender_psid, text.toLowerCase())) {
                response.text = `Chờ tý, đang cập nhật thời khoá biểu của ${text}...`;
                searchSchedule.updateData(client, sender_psid, text.toLowerCase());
              }
            } else {
              searchSchedule.sendSchedule(sender_psid, text.toLowerCase(), userSearchScheduleData);
            }
          } else sendResponse(sender_psid, response);
        }
      } else {
        console.log("getData: Unable to connect to database");
        sendResponse(sender_psid, response);
      }
    }
  } else if(received_message.attachments) {
      console.log("Received attachment");
      sendResponse(sender_psid, response);
  }
}

function handlePostback(sender_psid, received_postback) {
  let response = {
    "text": "Tính năng này hiện không khả dụng do dev đang lười và chưa có ny T.T"
  };
  console.log('postback' + "\n---------------------------------");
  deleteUserData(sender_psid);
  // Get the payload of receive postback
  let payload = received_postback.payload;
  // Set response based on payload
  switch (payload) {
    case "getStarted":
      response.text = "Xin chào! Tớ tên Jay, rất vui được gặp cậu :D Tớ được thiết lập sẵn để cung cấp cho cậu các tính năng có trong Menu, cứ thoải mái vung tay mà sử dụng nhé :>";
      sendResponse(sender_psid, response);
      break;
    case "searchSchedule":
      response = stuff.searchScheduleAskGroup;
      sendResponse(sender_psid, response);
      searchSchedule.initData(client, sender_psid);
      break;
    case "searchSubject":
      sendResponse(sender_psid, response);
      break;
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
    case "liveChat":

      break;
    default:
      response.text = "Tìm tính năng cậu cần ở phần Menu nha <3";
      sendResponse(sender_psid, response);
  }
}

function deleteUserData(sender_psid) {
  searchSchedule.deleteData(client, sender_psid);
}

function checkGroup(sender_psid, group) {
  const checkArray = ['10t1', '10t2', '10l', '10h', '10si', '10ti', '10v1', '10v2', '10su', '10đ','10a1', '10a2', '11t', '11l', '11h', '11si', '11ti', '11v', '11su', '11đ','11c1','11c2', '11a1', '11a2', '12t', '12l', '12h', '12si', '12ti', '12v', '12su', '12đ', '12c1', '12c2', '12a1', '12a2'];
  if(checkArray.includes(group)) return true;
  else {
    const response = stuff.searchScheduleCheckGroupResponse;
    sendResponse(sender_psid, response);
    return false;
  }
}
})();
