setTimeout(function(){
  (function(){
    id = Ti.App.Properties.getString("tisink", "");
    var param, xhr;
    file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/custom_properties_2.js");
    text = (file.read()).text
    xhr = Titanium.Network.createHTTPClient();
    xhr.open("POST", "http://tisink.nodester.com/");
    xhr.setRequestHeader("content-type", "application/json");
    param = {
      data: text,
      file: "custom_properties_2.js",
      id: id
    };
    xhr.send(JSON.stringify(param));
  })();
},0);
//TISINK----------------

var win = Titanium.UI.currentWindow;

// pull properties off of current window object an display
var l = Titanium.UI.createLabel({
	top:0,
	height:'auto',
	width:300,
	color:'#777',
	font:{fontSize:16},
	text:'func: ' + win.myFunc() + '\nstring (1): ' + win.stringProp1 + '\nstring (2): ' + win.stringProp2 + '\nnum (1):' + win.numProp1 + '\nnum (2):' + win.numProp2 + '\nobj (name):' + win.objProp1.name + '\nobj (age):' + win.objProp1.age
});
win.add(l);

