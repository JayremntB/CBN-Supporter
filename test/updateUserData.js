const { MongoClient } = require('mongodb');
// const connectionUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0-obtbe.mongodb.net/test`;
// const connectionUrl = "mongodb://127.0.0.1:27017"
const connectionUrl = process.env.DATABASE_URI;
const dbName = "database-for-cbner";
MongoClient.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if(err) {
    return console.log('Failed to connect to database');
  }
  console.log("Connect successfully");
  const date = new Date();
  date.setHours(date.getHours() + 7); // deploy at US
  const timeNow = date.getTime();
  client.db(dbName).collection('users-data').updateMany({}, {
    $set: {
      simsimi_lang: "vi"
    }
  }, (err) => {
    if(err) console.error(err);
    else console.log("successfully updated!");
  });
});
