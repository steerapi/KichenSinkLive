(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/push_notification.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "push_notification.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;


var label = Ti.UI.createLabel({
	text:'Attempting to register with Apple for Push Notifications...',
	textAlign:'center',
	width:'auto'
});

win.add(label);

// register for push notifications
Ti.Network.registerForPushNotifications({
	types: [
		Ti.Network.NOTIFICATION_TYPE_BADGE,
		Ti.Network.NOTIFICATION_TYPE_ALERT,
		Ti.Network.NOTIFICATION_TYPE_SOUND
	],
	success:function(e)
	{
		var deviceToken = e.deviceToken;
		label.text = "Device registered. Device token: \n\n"+deviceToken;
		Ti.API.info("Push notification device token is: "+deviceToken);
		Ti.API.info("Push notification types: "+Ti.Network.remoteNotificationTypes);
		Ti.API.info("Push notification enabled: "+Ti.Network.remoteNotificationsEnabled);
	},
	error:function(e)
	{
		label.text = "Error during registration: "+e.error;
	},
	callback:function(e)
	{
		// called when a push notification is received.
		alert("Received a push notification\n\nPayload:\n\n"+JSON.stringify(e.data));
	}
});	
;