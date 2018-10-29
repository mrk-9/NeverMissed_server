
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.afterSave("Message", function(request) {
   console.log('afterSave -> Message');
   var fromUser = request.object.get('user');
   var conversation = request.object.get('conversationId')
   fromUser.fetch().then(function(from) {
     return conversation.fetch().then(function(conv) {
       var otherUserID = conv.get('user1').id
       if(otherUserID == from.id) {
         otherUserID = conv.get('user2').id
       }
       console.log('user_' + otherUserID);
       console.log(request.object.get('text'));
       console.log(request.object.get('conversationId').id);
       console.log(from.get("name"));
       Parse.Push.send({
         channels: ['user_' + otherUserID],
         data: {
           type: "message",
           messageBody: request.object.get('text'),
           connection: request.object.get('conversationId').id,
           alert: "New Message",
           name: from.get("name"),
           badge: "Increment"
         }
       }, { useMasterKey: true }).then(function () {
         // Push was successful
         console.log('Message Push Success!!!');
       }, function (error) {
         console.log('Push Error');
         throw "Got an error pushing message" + error.code + " : " + error.message;
       });
     });

   }, function (error) {

   });

});

Parse.Cloud.afterSave("Notification", function(request) {
  console.log('afterSave -> Notification');

  var posting = request.object.get('posting');
  var forUser = request.object.get('for');
  var notificationID = request.object.id;

  Parse.Push.send({
    channels: ['user_' + forUser.id],
    data: {
      type: "always_on",
      connection: posting.id,
      alert: "Possible Connection",
      notification: notificationID,
      badge: "Increment"
    }
  }, { useMasterKey: true }).then(function () {
    // Push was successful
    console.log('Notification Push Success!!!');
  }, function (error) {
    console.log('Push Error');
    throw "Got an error pushing message" + error.code + " : " + error.message;
  });

});

/*Parse.Cloud.afterSave("Connection", function(request) {
  console.log('afterSave -> Connection');

  var connectionID = request.object.id;
  var forUser = request.object.get('user2');
  console.log("connectionID:"+request.object.id);
  console.log("user2 ID:"+forUser.id);
  
  Parse.Push.send({
    channels: ['user_' + forUser.id],
    data: {
      type: "connection",
      connection: connectionID,
      alert: "New Connection",
      badge: "Increment"
    }
  }, { useMasterKey: true }).then(function () {
    // Push was successful
    console.log('Connection Push Success!!!');
  }, function (error) {
    console.log('Push Error');
    throw "Got an error pushing message" + error.code + " : " + error.message;
  });

});

Parse.Cloud.afterDelete("Connection", function(request) {
  console.log('afterDelete -> Connection');

  var forUser = request.object.get('user2');
  var connectionId = request.object.id

  Parse.Push.send({
    channels: ['user_' + forUser.id],
    data: {
      type: "connection",
      connection: connectionID,
      alert: "New Connection",
      badge: "Increment"
    }
  }, { useMasterKey: true }).then(function () {
    // Push was successful
    console.log('Connection Push Success!!!');
  }, function (error) {
    console.log('Push Error');
    throw "Got an error pushing message" + error.code + " : " + error.message;
  });

});*/

// // request 3 values from frontend -> longitude, latitude and venue
// Parse.Cloud.httpRequest({
//   url: 'https://never-missed-dev.herokuapp.com/parse/checkin',
//  method: 'POST',//define your method
//  body: {
//     "venue": 'MY Name',
//     "age": '22'
//   }
// }).then(function(httpResponse) {
//   console.log(httpResponse.text);
// }, function(httpResponse) {
//   console.error('Request failed with response code ' + httpResponse.status);
// });

// Parse.Cloud.define("averageStars", function(request, response) {
//   const query = new Parse.Query("Review");
//   query.equalTo("movie", request.params.movie);
//   query.find()
//     .then((results) => {
//       let sum = 0;
//       for (let i = 0; i < results.length; ++i) {
//         sum += results[i].get("stars");
//       }
//       response.success(sum / results.length);
//     })
//     .catch(() =>  {
//       response.error("movie lookup failed");
//     });
// });
