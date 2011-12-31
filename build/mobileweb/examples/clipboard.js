(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/clipboard.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "clipboard.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

// initialize to all modes
win.orientationModes = [
	Ti.UI.PORTRAIT,
	Ti.UI.LANDSCAPE_LEFT,
	Ti.UI.LANDSCAPE_RIGHT
]; 

var source = Ti.UI.createTextField({
	height:45,
	top:10,
	left:10,
	width:250,
	hintText: 'type here',
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});
win.add(source);

var copy = Ti.UI.createButton({
	title:'Copy',
	height:40,
	top:55,
	left:10,
	width:250
});
copy.addEventListener('click', function()
{
	Ti.UI.Clipboard.setText(source.value);
});
win.add(copy);

var dest = Ti.UI.createTextField({
	height:45,
	top:120,
	left:10,
	width:250,
	hintText: 'paste here',
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});
win.add(dest);

var paste = Ti.UI.createButton({
	title:'Paste',
	height:40,
	top:165,
	left:10,
	width:250
});
paste.addEventListener('click', function()
{
	if (Ti.UI.Clipboard.hasText()) {
		dest.value = Ti.UI.Clipboard.getText();
	} else {
		alert('No text on clipboard.');
	}
});
win.add(paste);

// TODO: add demo of copy/pasting images, URLs on iPhone
;