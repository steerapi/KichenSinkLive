(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/facebook_login_logout.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "facebook_login_logout.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
/*globals Titanium, Ti, alert, JSON */
var win = Ti.UI.currentWindow;
Ti.Facebook.appid = "134793934930";
Ti.Facebook.permissions = ['publish_stream', 'read_stream'];
//
// Login Status
//
var label = Ti.UI.createLabel({
	text:'Logged In = ' + Ti.Facebook.loggedIn,
	font:{fontSize:14},
	height:'auto',
	top:10,
	textAlign:'center'
});
win.add(label);

var forceButton = Ti.UI.createButton({
	title:'Force dialog: '+Ti.Facebook.forceDialogAuth,
	top:50,
	width:160,
	height:40
});
forceButton.addEventListener('click', function() {
	Ti.Facebook.forceDialogAuth = !Ti.Facebook.forceDialogAuth;
	forceButton.title = "Force dialog: "+Ti.Facebook.forceDialogAuth;
});
win.add(forceButton);

function updateLoginStatus() {
	label.text = 'Logged In = ' + Ti.Facebook.loggedIn;
}

// capture
Ti.Facebook.addEventListener('login', updateLoginStatus);
Ti.Facebook.addEventListener('logout', updateLoginStatus);

//
// Login Button
//
if(Ti.Platform.name == 'iPhone OS'){
	win.add(Ti.Facebook.createLoginButton({
		style:Ti.Facebook.BUTTON_STYLE_WIDE,
		bottom:30
	}));
}
else{
	win.add(Ti.Facebook.createLoginButton({
		style:'wide',
		bottom:30
	}));
}
;