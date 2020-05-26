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
  client.db(dbName).collection('users-data').updateMany({}, {
    $set: {
      room_chatting: {
        block: false,
        has_joined: false,
        type: "",
        create_new_subroom: false,
        room_id: "",
        pre_room: 1,
        persona_id: "3363745553659185",
        name: "Người lạ",
        img_url: "https://i.imgur.com/187Y4u3.png"
      }
    }
  }, (err) => {
    if(err) console.error(err);
    else console.log("successfully updated!");
  });
});
