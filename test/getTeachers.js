const { MongoClient } = require('mongodb');
// const connectionUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0-obtbe.mongodb.net/test`;
// const connectionUrl = "mongodb://127.0.0.1:27017"
const connectionUrl = process.env.DATABASE_URI;
const dbName = "database-for-cbner";
const teacherName = "NT.Lê";
MongoClient.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if(err) {
    return console.log('Failed to connect to database');
  }
  console.log("Connect successfully");
  const db = client.db(dbName);
  const collection = db.collection('schedule');
  // collection.find({
  //   $or: [
  //     {"schedule.morning.teacher": teacherName},
  //     {"schedule.afternoon.teacher": teacherName}
  //   ]
  // }).toArray((err, docs) => {
  //   if(err) console.log(err);
  //   else {
  //     let res = [];
  //     for(let i = 0; i < 6; i ++) { // loop days
  //       res.push({
  //         "morning": [],
  //         "afternoon": []
  //       });
  //       for(let j = 0; j < 5; j ++) {
  //         docs.forEach((doc) => {
  //           if(doc.schedule[i].morning[j] && doc.schedule[i].morning[j].teacher === teacherName){
  //             res[i].morning.push(doc.group);
  //             return;
  //           }
  //         });
  //         docs.forEach((doc) => {
  //           if(doc.schedule[i].afternoon[j] && doc.schedule[i].afternoon[j].teacher === teacherName){
  //             res[i].afternoon.push(doc.group);
  //             return;
  //           }
  //         });
  //       }
  //     }
  //     console.log(res);
  //     res.forEach((day) => {
  //       console.log(day.morning);
  //       console.log(day.afternoon);
  //     });
  //   }
  // });
  collection.find({}).toArray((err, docs) => {
    if(err) console.log(err);
    else {
      let arr = [];
      docs.forEach((doc) => {
        doc.schedule.forEach((doc1) => {
          doc1.morning.forEach((doc2) => {
            if(doc2.teacher !== "" && !arr.includes(doc2.teacher)) arr.push(doc2.teacher);
          });
          doc1.afternoon.forEach((doc2) => {
            if(doc2.teacher !== "" && !arr.includes(doc2.teacher)) arr.push(doc2.teacher);
          });
        });
      });
      arr.sort((a, b) => {
          let nameA = a.toUpperCase().split(".")[1].split("")[0];
          let nameB = b.toUpperCase().split(".")[1].split("")[0];
          if(nameA < nameB) return -1;
          if(nameA > nameB) return 1;
          return 0;
        });
      // arr.forEach((name, i) => {
      //   console.log(name);
      // });
      console.log(arr);
    }
  });
});
