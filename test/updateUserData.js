const { MongoClient } = require('mongodb');
const request = require('request');
// const connectionUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0-obtbe.mongodb.net/test`;
// const connectionUrl = "mongodb://127.0.0.1:27017"
const connectionUrl = process.env.DATABASE_URI;
const dbName = "database-for-cbner";
MongoClient.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true }, async (err, client) => {
  if(err) {
    return console.log('Failed to connect to database');
  }
  console.log("Connect successfully");
  const date = new Date();
  date.setHours(date.getHours() + 7); // deploy at US
  const timeNow = date.getTime();
  // update
  // client.db(dbName).collection('users-data').updateMany({}, {
  //   $set: {
  //     // simsimi_lang: "vi" // simsimi update
  //   }
  // }, (err) => {
  //   if(err) console.error(err);
  //   else console.log("successfully updated!");
  // });

  // add name
  // let usersData = await client.db(dbName).collection('users-data').find({}).toArray();
  // usersData.forEach(userData => {
  //   request({
  //     "uri": `https://graph.facebook.com/${userData.sender_psid}`,
  //     // "qs": { "access_token": process.env.TEST_PAGE_ACCESS_TOKEN },
  //     "qs": {
  //       "access_token": process.env.PAGE_ACCESS_TOKEN,
  //       "fields": "name,profile_pic"
  //     },
  //     "method": "GET"
  //   }, (err, res, body) => {
  //     body = JSON.parse(body);
  //     console.log(body.name);
  //     client.db(dbName).collection('users-data').updateOne({ sender_psid: userData.sender_psid }, {
  //       $set: {
  //         name: body.name
  //       }
  //     }, (err) => {
  //       console.log(userData.sender_psid + " -> " + body.name);
  //     });
  //   });
  // });

  // kick all users
  client.
});
