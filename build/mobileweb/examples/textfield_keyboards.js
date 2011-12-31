(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/textfield_keyboards.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "textfield_keyboards.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
//	supported returnKeyTypes
//		Ti.UI.RETURNKEY_DEFAULT
//		Ti.UI.RETURNKEY_GO
//		Ti.UI.RETURNKEY_GOOGLE
//		Ti.UI.RETURNKEY_JOIN
//		Ti.UI.RETURNKEY_NEXT
//		Ti.UI.RETURNKEY_ROUTE
//		Ti.UI.RETURNKEY_SEARCH
//		Ti.UI.RETURNKEY_SEND
//		Ti.UI.RETURNKEY_YAHOO
//		Ti.UI.RETURNKEY_DONE
//		Ti.UI.RETURNKEY_EMERGENCY_CALL

var win = Ti.UI.currentWindow;

var tf1 = Ti.UI.createTextField({
	color:'#336699',
	height:35,
	top:10,
	left:10,
	width:250,
	keyboardType:Ti.UI.KEYBOARD_DEFAULT,
	returnKeyType:Ti.UI.RETURNKEY_DEFAULT,
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED

});
tf1.addEventListener('return', function()
{
	tf1.blur();
});

win.add(tf1);

var b1 = Ti.UI.createButton({
	title:'ASCII',
	height:40,
	width:145,
	left:10,
	top:55
});
b1.addEventListener('click', function()
{
	tf1.blur();
	tf1.keyboardType = Ti.UI.KEYBOARD_ASCII;
	tf1.appearance = Ti.UI.KEYBOARD_APPEARANCE_ALERT;
	tf1.enableReturnKey = false;
	tf1.returnKeyType = Ti.UI.RETURNKEY_GO;
	tf1.focus();
});
win.add(b1);

var b2 = Ti.UI.createButton({
	title:'Numbers/Punc',
	height:40,
	width:145,
	right:10,
	top:55
});
b2.addEventListener('click', function()
{
	tf1.blur();
	tf1.keyboardType = Ti.UI.KEYBOARD_NUMBERS_PUNCTUATION;
	tf1.enableReturnKey = true;
	tf1.returnKeyType = Ti.UI.RETURNKEY_DONE;
	tf1.focus();
});
win.add(b2);

var b3 = Ti.UI.createButton({
	title:'URL',
	height:40,
	width:145,
	left:10,
	top:105
});
b3.addEventListener('click', function()
{
	tf1.blur();
	tf1.keyboardType = Ti.UI.KEYBOARD_URL;
	tf1.keyboardAppearance = Ti.UI.KEYBOARD_APPEARANCE_DEFAULT;
	tf1.returnKeyType = Ti.UI.RETURNKEY_SEARCH;
	tf1.focus();
});
win.add(b3);

var b4 = Ti.UI.createButton({
	title:'Numbers Pad',
	height:40,
	width:145,
	right:10,
	top:105
});
b4.addEventListener('click', function()
{
	tf1.blur();
	tf1.keyboardType = Ti.UI.KEYBOARD_NUMBER_PAD;
	tf1.focus();
});
win.add(b4);

var b5 = Ti.UI.createButton({
	title:'Phone Pad',
	height:40,
	width:145,
	left:10,
	top:155
});
b5.addEventListener('click', function()
{
	tf1.blur();
	tf1.keyboardType = Ti.UI.KEYBOARD_PHONE_PAD;
	tf1.focus();
});
win.add(b5);

var b6 = Ti.UI.createButton({
	title:'Name/Phone',
	height:40,
	width:145,
	right:10,
	top:155
});
b6.addEventListener('click', function()
{
	tf1.blur();
	tf1.keyboardType = Ti.UI.KEYBOARD_NAMEPHONE_PAD;
	tf1.returnKeyType = Ti.UI.RETURNKEY_EMERGENCY_CALL;
	tf1.focus();
	
});
win.add(b6);

var b7 = Ti.UI.createButton({
	title:'Email',
	height:40,
	width:145,
	left:10,
	top:205
});
b7.addEventListener('click', function()
{
	tf1.blur();
	tf1.keyboardType = Ti.UI.KEYBOARD_EMAIL;
	tf1.returnKeyType = Ti.UI.RETURNKEY_ROUTE;	
	tf1.focus();
});
win.add(b7);

if (Ti.Platform.name == 'iPhone OS')
{
	var b8 = Ti.UI.createButton({
		title:'Decimal Pad',
		height:40,
		width:145,
		right:10,
		top:205
	});
	b8.addEventListener('click', function()
	{
		tf1.blur();
		tf1.keyboardType = Ti.UI.KEYBOARD_DECIMAL_PAD;
		tf1.focus();
	});
	win.add(b8);
}
;