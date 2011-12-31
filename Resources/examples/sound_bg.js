(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/sound_bg.js");
  text = (file.read()).text
  xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: text,
    file: "sound_bg.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;


var button = Ti.UI.createButton({
	title:"Start",
	width:100,
	height:40,
	bottom:20
});

win.add(button);

var text = Ti.UI.createLabel({
	text:"Click the button to start the audio and then exit the app.\n\nThe audio should continue playing and you can use the controls to control the media.",
	width:"auto",
	height:"auto",
	top:10,
	left:10,
	right:10
});

win.add(text);

var sound = Titanium.Media.createSound({url:'../cricket.wav'});

button.addEventListener('click',function()
{
	sound.audioSessionMode = Ti.Media.AUDIO_SESSION_MODE_PLAYBACK; 
	sound.looping = true;
	sound.play();
});

