(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/notification.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "notification.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win= Ti.UI.currentWindow;

var countdown = 5;

var l = Ti.UI.createLabel({
	text:'Android Notification test in ',
	width:'auto',
	height:'auto'
});

win.add(l);

// Create a notification
var n = Ti.UI.createNotification({message:"Howdy folks"});
// Set the duration to either Ti.UI.NOTIFICATION_DURATION_LONG or NOTIFICATION_DURATION_SHORT
n.duration = Ti.UI.NOTIFICATION_DURATION_LONG;

// Setup the X & Y Offsets
n.offsetX = 100;
n.offsetY = 75;

// Make it a little bit interesting
var countdownSeconds = setInterval(function() {
	l.text = l.text + countdown+"..";
	countdown = countdown -1;
	if (countdown <0) {
		clearInterval(countdownSeconds);
		n.show();
	}
},1000);