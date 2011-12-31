setTimeout(function(){
  (function(){
    id = Ti.App.Properties.getString("tisink", "");
    var param, xhr;
    file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/xhr_error.js");
    text = (file.read()).text
    xhr = Titanium.Network.createHTTPClient();
    xhr.open("POST", "http://tisink.nodester.com/");
    xhr.setRequestHeader("content-type", "application/json");
    param = {
      data: text,
      file: "xhr_error.js",
      id: id
    };
    xhr.send(JSON.stringify(param));
  })();
},0);
//TISINK----------------

var win=Titanium.UI.currentWindow;

var l1 = Titanium.UI.createLabel({
	text:'UTF-8 GET',
	font:{fontSize:16,fontWeight:'bold'},
	top:10,
	width:300,
	left:10,
	height:'auto'
});
win.add(l1);

var l2 = Titanium.UI.createLabel({
	text:'Waiting for response...',
	font:{fontSize:13},
	top:40,
	left:10,
	width:300,
	height:'auto',
	color:'#888'
});
win.add(l2);

var xhr = Titanium.Network.createHTTPClient();

xhr.onload = function()
{
	l2.text = this.responseText;
};

xhr.onerror = function(e)
{
	l2.text = e.error;
};

// open the client
xhr.open('GET','http://www.fre100.com');

// send the data
xhr.send();
