(async () => {

// This file just for setting up single part of chatbot like get started button,
// persistent menu, greeting text,... and it does not support for main code and
// another files in this repository

const request = require('request');

await request({
  "uri": "https://graph.facebook.com/v6.0/me/messenger_profile",
  // "uri": "https://graph.facebook.com/me/personas",
  "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
  "method": "POST",
  "json": {
    "setting-type":"call_to_actions",
    "thread_state":"new_thread",
    "get_started": {
      "payload": "getStarted"
    }
  }
}, (err, res, body) => {
  console.log("getStarted: \n");
  if(err) console.error(err);
  else console.log(body);
});

await request({
  "uri": "https://graph.facebook.com/v6.0/me/messenger_profile",
  // "uri": "https://graph.facebook.com/me/personas",
  "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
  "method": "POST",
  "json": {
    "greeting":[{
      "locale":"default",
      "text":"Chào {{user_first_name}} nha :> Bấm GET STARTED/BẮT ĐẦU để khám phá những tính năng dành riêng cho CBNer nhé!"
    }]
  }
}, (err, res, body) => {
  console.log('greeting: \n');
  if(err) console.error(err);
  else console.log(body);
});

await request({
  "uri": "https://graph.facebook.com/v6.0/me/messenger_profile",
  // "uri": "https://graph.facebook.com/me/personas",
  "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
  "method": "POST",
  "json": {
    "persistent_menu": [
      {
        "locale": "default",
        "composer_input_disabled": false,
        "call_to_actions": [
          {
            "type": "nested",
            "title": "Tính năng chính",
            "call_to_actions": [
              {
                "type": "postback",
                "title": "Tìm thời khoá biểu",
                "payload": "searchSchedule"
              },
              {
                "type": "postback",
                "title": "Tìm môn học",
                "payload": "searchSubject"
              },
              {
                "type": "postback",
                "title": "Tìm tiết dạy",
                "payload": "searchClasses"
              }
            ]
          },
          {
            "type": "nested",
            "title": "Các tính năng khác",
            "call_to_actions": [
              {
                "type": "postback",
                "title": "Tính giờ dậy (ngủ)",
                "payload": "sawTime" // sleep and wake-up
              },
              {
                "type": "postback",
                "title": "Tình hình Covid-19",
                "payload": "checkCovid"
              }
            ]
          },
          {
            "type": "nested",
            "title": "Thông tin và cài đặt",
            "call_to_actions": [
              {
                "type": "postback",
                "title": "Cài đặt cá nhân",
                "payload": "setting"
              },
              {
                "type": "postback",
                "title": "Thông tin chatbot",
                "payload": "chatbotInformation"
              },
              {
                "type": "web_url",
                "title": "Liên hệ tớ (Messenger)",
                "url": "https://m.me/fukaijs",
                "webview_height_ratio": "full"
              }
            ]
          }
        ]
      }
    ]
  }
}, (err, res, body) => {
  console.log("persistent_menu: \n");
  if(err) console.error(err);
  else console.log(body);
});
})()
