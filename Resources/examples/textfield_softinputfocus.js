setTimeout(function(){
  (function(){
    id = Ti.App.Properties.getString("tisink", "");
    var param, xhr;
    file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/textfield_softinputfocus.js");
    text = (file.read()).text
    xhr = Titanium.Network.createHTTPClient();
    xhr.open("POST", "http://tisink.nodester.com/");
    xhr.setRequestHeader("content-type", "application/json");
    param = {
      data: text,
      file: "textfield_softinputfocus.js",
      id: id
    };
    xhr.send(JSON.stringify(param));
  })();
},0);
//TISINK----------------

var win = Ti.UI.currentWindow;
win.backgroundColor = 'white';

var label = Ti.UI.createLabel({
	top: 5, left: 10, right: 10, height:40,
	text : "Use trackball or D/PAD to change focus.",
	color: 'black'
});
win.add(label);

var tf1 = Ti.UI.createTextField({
	top: 50, left: 10, right: 10, height:40,
	softKeyboardOnFocus : Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS
});

win.add(tf1);

var tf2 = Ti.UI.createTextField({
	top: 95, left: 10, right: 10, height:40,
	softKeyboardOnFocus : Ti.UI.Android.SOFT_KEYBOARD_DEFAULT_ON_FOCUS
});

tf2.addEventListener('focus', function() {
	Ti.UI.createNotification({ message: 'focus'}).show();
});
win.add(tf2);

var tf3 = Ti.UI.createTextField({
	top: 140, left: 10, right: 10, height:40,
	softKeyboardOnFocus : Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS
});

tf3.addEventListener('focus', function() {
	Ti.UI.createNotification({ message: 'focus 2'}).show();
});
win.add(tf3);

var btn = Ti.UI.createButton({
	title: 'Close',
	top: 185, left: 10, right: 10, height:40,
	softKeyboardOnFocus : Ti.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS
});
btn.addEventListener("click", function(e) {
	win.close();
});
win.add(btn);