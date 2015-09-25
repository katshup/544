var serialPort = require('serialport');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host  : 'localhost',
  user  : 'root',
  password  : 'root',
  database  : 'mydb'
});

function getTimeStamp() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}

connection.connect();

function sensorExist(id, x, y){
  connection.query('SELECT * FROM `sensors` WHERE `id`=?', [id],function(error, row, fields){
    if(!error){
      if(row.length != 0){
        // do nothing if sensor is found
      } else {
        addSensor(id, x, y, 0, "");
      }
    } else {
      console.log('oh noes\n');
      return false;
    }
  });
}

function addSensor(id, x, y, temp, time){
  connection.query('INSERT INTO `sensors` VALUES (?, ?, ?)', [id, x, y],function(error, row, fields){
    if(!error){
      console.log("new sensor was added\n");
      addTemperature(id, temp, time);
    } else {
      console.log('oh noes\n');
      return false;
    }
  });
}

// time is formated as YYYY-MM-DD HH:MM:SS
function addTemperature(id, temp, time){
  connection.query('INSERT INTO `temperatures` (time, temp, sensors_id) VALUES (?, ?, ?)', [getTimeStamp(), temp, id], function(error, row, fields){
    if(!error){
      console.log("row was added\n");
    } else {
      console.log("oh noes\n");
      console.log(error);
      addSensor(id, 0, 0, temp, time);
    }
  });
}

function queryTempBySensor(id){
  connection.query('SELECT * FROM `sensors` WHERE `id`=? ORDER BY `time` ASC', [id], function(error, row, fields){
    if(!error){
      // do stuff here
    } else {
      console.log("oh noes\n");
    }
  });
}

function queryAverage(){
  connection.query('SELECT * FROM `average` ORDER BY `time` ASC', function(error, row, fields){
    if(!error){
      // do stuff here
    } else {
      console.log("oh noes\n");
    }
  });
}

function insertAverage(value){
  connection.query('INSERT INTO `average` (average, time) VALLUES (?, ?)', [value, getTimeStamp()], function(error, row, fields){
    if(!error){
      // do stuff here
    } else {
      console.log("oh noes\n");
    }
  });
}

addTemperature(51, 20, getTimeStamp());
