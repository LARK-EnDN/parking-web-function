const functions = require('firebase-functions');
var admin = require("firebase-admin");
var CronJob = require('cron').CronJob;
var request = require("request");
var serviceAccount = require("./service-account.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://testeverything-63c3c.firebaseio.com"
});
var db = admin.database();
var CronJob = require('cron').CronJob;
console.log('Start');

function partstatus(){
  var count=0;
  var path = 'status_and_name'
  var ref = db.ref(path);
  ref.on("value",function(snapshot) {
      snapshot.forEach(function(data){
      path = 'status_and_name'
      path += '/'+data.key;//b1 2 3
      ref = db.ref(path);
      // console.log(path);//
      ref.on("value",function(snapshot) {
        snapshot.forEach(function(data){
          path1 = path;
          path1 += '/'+data.key;//f1 2 3
          // console.log(path1);
          ref = db.ref(path1);
          ref.on("value",function(snapshot) {
            snapshot.forEach(function(data){
              path2 = path1;
              path2 += '/'+data.key;//board || sensor
              ref = db.ref(path2);
              ref.on("value",function(snapshot) {
                snapshot.forEach(function(data){
                  //console.log(path2+'/'+data.key);
                  timepart = path2+'/'+data.key
                  date = new Date();
                  // console.log(date);
                  ref = db.ref(timepart+'/datetime');
                  ref.on("value",function(snapshot) {
                    //console.log(snapshot.val());
                    // count++;
                    // console.log(count);
                    
                  })
                  // ref.set(date);
                })
              })
            })
          })
        })
      })
    })
  });
  
  
}
partstatus();


  /*
  function formatDate() {
    var date = new Date();
    var day = date.getDate();
    day = day < 10 ? '0'+day : day;
    var month = date.getMonth()+1;
    month = month < 10 ? '0'+month : month;
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var sec = date.getSeconds();
    sec = sec < 10 ? '0'+sec: sec;
    var Hours = date.getHours();
    Hours = Hours < 10 ? '0'+Hours: Hours;
    var strTime = Hours + ':' + minutes + ':'+ sec;
    return  day + "-" + month + "-" + date.getFullYear() + " " + strTime;
  }

function chack(){
  var startHour = extractedStartHour;
  var startMinute = extractedStartMinute;
  var startSecond = extractedStartSecond;
 
  var endHour = extractedEndHour;
  var endMinute = extractedEndMinute;
  var endSecond = extractedEndSecond;
 
  //Create date object and set the time to that
  var startTimeObject = new Date();
  startTimeObject.setHours(startHour, startMinute, startSecond);
 
  //Create date object and set the time to that
  var endTimeObject = new Date(startTimeObject);
  endTimeObject.setHours(endHour, endMinute, endSecond);

  alert(startTimeObject - endTimeObject);
}
*/