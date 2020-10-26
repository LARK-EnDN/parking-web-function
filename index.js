const functions = require('firebase-functions');
var admin = require("firebase-admin");
// var request = require("request");

var serviceAccount = require("./service-account.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://testeverything-63c3c.firebaseio.com"
});

// exports.sendMessage = functions.https.onRequest(async (req, res) => {
//   console.log('Runing sendMessage');
  // var db = admin.database();
  // var ref = db.ref('Alert_text');
  // ref.on("value", function(snapshot) {
  //   // console.log(snapshot.key);
  //   snapshot.forEach(function(data){
  //     path = '/'+data.key;
  //     // console.log(path); 
  //     ref = db.ref(path);
  //     ref.on("value", function(snapshot) {
  //       // console.log(data.key);
  //       var request = require("request");
  //       request({
  //             method: 'POST',
  //             uri: 'https://notify-api.line.me/api/notify',
  //             header: {'Content-Type': 'application/x-www-form-urlencoded'},
  //             auth: {bearer: 'RIT17u21ORRf473TjSqP7fYuXLzlgFNzHBGqomikX7M'},
  //             form: {message: data.key +' : '+ data.val().text}/////message
  //       })
  //     })
  //   })
  // })
// });



// var db = admin.database();
// var ref = db.ref("/message/");
// ref.once("value", function(snapshot) {
//   console.log(snapshot.val());
// });

// exports.onDataAdded = functions.database
//   .ref("/message/{id}")
//   .onWrite(event => {
//     const data = event.val();
//     const newData = {
//       msg: data.msg.toUpperCase()
//     };
//     return event.ref.parent.child("copiedData").set(newData);
//   });

// console.log('start+');