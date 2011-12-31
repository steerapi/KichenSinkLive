(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/window_layout.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "window_layout.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;
win.backgroundColor = '#13386c';
win.barColor = '#13386c';

//
//  CREATE FIELD ONE
//
var firstName = Ti.UI.createLabel({
	color:'#fff',
	text:'First Name',
	top:10,
	left:30,
	width:100,
	height:'auto'
});

win.add(firstName);

var firstNameField = Ti.UI.createTextField({
	hintText:'enter first name',
	height:35,
	top:35,
	left:30,
	width:250,
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});

win.add(firstNameField);

//
//  CREATE FIELD TWO
//
var lastName = Ti.UI.createLabel({
	color:'#fff',
	text:'Last Name',
	top:75,
	left:30,
	width:100,
	height:'auto'
});

win.add(lastName);

var lastNameField = Ti.UI.createTextField({
	hintText:'enter last name',
	height:35,
	top:100,
	left:30,
	width:250,
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});

win.add(lastNameField);

//
// CREATE BUTTON
//
var save = Ti.UI.createButton({
	title:'Save my Information',
	top:170,
	left:30,
	height:30,
	width:250
});
win.add(save);

//
//  CREATE INFO MESSAGE
//
var messageView = Ti.UI.createView({
	bottom:10,
	backgroundColor:'#111',
	height:40,
	width:270,
	borderRadius:10
});

var messageLabel = Ti.UI.createLabel({
	color:'#fff',
	text:'Register for a free toaster!',
	height:'auto',
	width:'auto',
	textAlign:'center'
});

messageView.add(messageLabel);

win.add(messageView);