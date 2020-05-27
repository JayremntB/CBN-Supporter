const { MongoClient } = require('mongodb');
const sendResponse = require('../general/sendResponse');
// const connectionUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0-obtbe.mongodb.net/test`;
// const connectionUrl = "mongodb://127.0.0.1:27017";
const connectionUrl = process.env.DATABASE_URI;
const dbName = "database-for-cbner";
const response = {
  'text': 'Đã có tính năng mới TÌM BẠN BỐN PHƯƠNG (CHAT ẨN DANH), bạn hãy vào trải nghiệm thử nhé <3'
};

MongoClient.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if(err) {
    return console.log('Failed to connect to database');
  }
  console.log("Connect successfully");
  client.db(dbName).collection('users-data').find({}).toArray((err, usersData) => {
    usersData.forEach((userData) => {
      sendResponse(userData.sender_psid, response);
    });
    console.log("successfully send message to all server");
  });
});
