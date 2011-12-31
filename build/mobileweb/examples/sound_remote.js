(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/sound_remote.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "sound_remote.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var url = Ti.UI.createTextField({
	value:'http://watoo.net:8000/INTRODUCTION.mp3',
	color:'#336699',
	returnKeyType:Ti.UI.RETURNKEY_GO,
	keyboardType:Ti.UI.KEYBOARD_URL,
	hintText:'url',
	textAlign:'left',
	clearOnEdit:false, // this set to true was clearing the field on launch
	height:35,
	top:10,
	width:300,
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED
});

var streamButton = Ti.UI.createButton({
	title:'Start Streaming',
	top:60,
	width:200,
	height:40
});

var pauseButton = Ti.UI.createButton({
	title:'Pause Streaming',
	top:110,
	width:200,
	height:40,
	enabled:false
});

var progressLabel = Ti.UI.createLabel({
	text:'Time Played: Not Started',
	top:160,
	left:10,
	height:40,
	width:300,
	color:'#555',
	textAlignment:'center'
});
var stateLabel = Ti.UI.createLabel({
	text:'State: Not Started',
	top:180,
	left:10,
	width:300,
	height:40,
	color:'#555'
});

var streamSize1 = Ti.UI.createButton({
	title:'Small buffer',
	top:240,
	left:10,
	width:100,
	height:40
});
var streamSize2 = Ti.UI.createButton({
	title:'Default buffer',
	top:240,
	left:110,
	width:100,
	height:40
});
var streamSize3 = Ti.UI.createButton({
	title:'Large buffer',
	top:240,
	right:10,
	width:100,
	height:40	
});

Ti.UI.currentWindow.add(url);
Ti.UI.currentWindow.add(streamButton);
Ti.UI.currentWindow.add(pauseButton);
Ti.UI.currentWindow.add(progressLabel);
Ti.UI.currentWindow.add(stateLabel);
if (Ti.Platform.name != 'android') {
	Ti.UI.currentWindow.add(streamSize1);
	Ti.UI.currentWindow.add(streamSize2);
	Ti.UI.currentWindow.add(streamSize3);
}
var streamer = Ti.Media.createAudioPlayer();

streamButton.addEventListener('click',function()
{
	if (streamButton.title == 'Stop Stream')
	{
		progressLabel.text = 'Stopped';
		streamer.stop();
		pauseButton.enabled = false;
		streamSize1.enabled = true;
		streamSize2.enabled = true;
		streamSize3.enabled = true;
		pauseButton.title = 'Pause Streaming';
		streamButton.title = "Start Streaming";
	}
	else
	{
		progressLabel.text = 'Starting ...';
		streamer.url = url.value;
		streamer.start();
		pauseButton.enabled = true;
		streamSize1.enabled = false;
		streamSize2.enabled = false;
		streamSize3.enabled = false;

		pauseButton.title = 'Pause Streaming';
		streamButton.title = "Stop Stream";
	}
});

pauseButton.addEventListener('click', function()
{
	streamer.pause();
	if (streamer.paused) {
		pauseButton.title = 'Unpause Streaming';
	}
	else {
		pauseButton.title = 'Pause Streaming';
	}
});

streamSize1.addEventListener('click', function()
{
	streamer.bufferSize = 512;
	Ti.API.log('Set streamer buffer size to ' + streamer.bufferSize);
});
streamSize2.addEventListener('click', function()
{
	streamer.bufferSize = 2048;
	Ti.API.log('Set streamer buffer size to ' + streamer.bufferSize);
});
streamSize3.addEventListener('click', function()
{
	streamer.bufferSize = 4096;
	Ti.API.log('Set streamer buffer size to ' + streamer.bufferSize);
});

streamer.addEventListener('progress',function(e)
{
	progressLabel.text = 'Time Played: ' + Math.round(e.progress) + ' milliseconds';
});

streamer.addEventListener('change',function(e)
{
	stateLabel.text = 'State: '+e.description +' ('+e.state+')';
	if(e.description == "stopped") {
		progressLabel.text = 'Stopped';
		pauseButton.enabled = false;
		pauseButton.title = 'Pause Streaming';
		streamButton.title = "Start Streaming";
	}
});

// save off current idle timer state
var idleTimer = Ti.App.idleTimerDisabled;

// while we're in this window don't let the app shutdown
// when the screen is idle
Ti.App.idleTimerDisabled = true;

win.addEventListener('close',function()
{
	Ti.API.info("window was closed, idleTimer reset to = "+idleTimer);

	// restore previous idle state when closed
	Ti.App.idleTimerDisabled = idleTimer;
});