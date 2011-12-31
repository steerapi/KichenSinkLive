(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile("examples/set_timeout.js");
  xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "set_timeout.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Titanium.UI.currentWindow;

var label = Ti.UI.createLabel({
	text:'Running...',
	font:{fontFamily:'Helvetica Neue',fontSize:24,fontWeight:'bold'},
	color:'#999',
	textAlign:'center'
});

var act = Ti.UI.createActivityIndicator({
	bottom:10
});
act.style = Titanium.UI.iPhone.ActivityIndicatorStyle.DARK;
act.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
act.color = 'black';
act.message = 'Waiting for timer to fire...';
act.show();

win.add(label);
win.add(act);

var started = new Date().getTime();

setTimeout(function()
{
	act.hide();

	label.text = "3 sec timer fired in\n" + (new Date().getTime()-started)/1000 + " seconds";
},3000);

