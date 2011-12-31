(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/sound_file_url.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "sound_file_url.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'cricket.wav');
var file2 = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'pop.caf');

// load from file object but use the nativepath
var sound = Ti.Media.createSound({url:file.nativePath});

//
// PLAY
//
var play = Ti.UI.createButton({
	title:'Play',
	height:40,
	width:145,
	left:10,
	top:10
});
play.addEventListener('click', function()
{
	sound.play();
	pb.max = sound.duration;
});
win.add(play);

//
// PAUSE
//
var pause = Ti.UI.createButton({
	title:'Pause',
	height:40,
	width:145,
	right:10,
	top:10
});
pause.addEventListener('click', function()
{
	sound.pause();
});
win.add(pause);

//
// RESET
//
var reset = Ti.UI.createButton({
	title:'Reset',
	height:40,
	width:145,
	left:10,
	top:60
});
reset.addEventListener('click', function()
{
	sound.reset();
	pb.value = 0;

});
win.add(reset);

//
// STOP
//
var stop = Ti.UI.createButton({
	title:'Stop',
	height:40,
	width:145,
	right:10,
	top:60
});
stop.addEventListener('click', function()
{
	sound.stop();
	pb.value = 0;
});
win.add(stop);

//
// VOLUME +
//
var volumeUp = Ti.UI.createButton({
	title:'Volume++',
	height:40,
	width:145,
	left:10,
	top:110
});
volumeUp.addEventListener('click', function()
{
	if (sound.volume < 1.0)
	{
		sound.volume += 0.1;
		var roundedVolume = Math.round(sound.volume*1000)/1000;
		volumeUp.title = 'Volume++ (' + roundedVolume + ')';
		volumeDown.title = 'Volume--';
	}
});
win.add(volumeUp);

//
// VOLUME -
//
var volumeDown = Ti.UI.createButton({
	title:'Volume--',
	height:40,
	width:145,
	right:10,
	top:110
});
volumeDown.addEventListener('click', function()
{
	if (sound.volume > 0)
	{
		if (sound.volume < 0.1){
			sound.volume = 0;
		} else {
			sound.volume -= 0.1;
		}
		var roundedVolume = Math.round(sound.volume*1000)/1000;
		volumeDown.title = 'Volume-- (' + roundedVolume + ')';
		volumeUp.title = 'Volume++';
	}

});
win.add(volumeDown);

//
// LOOPING
//
var looping = Ti.UI.createButton({
	title:'Looping (false)',
	height:40,
	width:145,
	left:10,
	top:160
});
looping.addEventListener('click', function()
{
	sound.looping = (sound.looping === false)?true:false;
	looping.title = 'Looping (' + sound.isLooping() + ')';
});
win.add(looping);

//
// CHANGE URL (#1488)
//
var fileNum = 0;
var urlChange = Ti.UI.createButton({
	title:'Change file',
	height:40,
	width:145,
	right:10,
	top:160
});
urlChange.addEventListener('click', function()
{
	if (fileNum === 0) {
		sound.url = file2.nativePath;
		fileNum = 1;
	}
	else {
		sound.url = file.nativePath;
		fileNum = 0;
	}
});
win.add(urlChange);

//
// EVENTS
//
sound.addEventListener('complete', function()
{
	pb.value = 0;
});
sound.addEventListener('resume', function()
{
	Ti.API.info('RESUME CALLED');
});

//
//  PROGRESS BAR TO TRACK SOUND DURATION
//
var flexSpace = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});
var pb = Ti.UI.createProgressBar({
	min:0,
	value:0,
	width:200
});

if (Ti.Platform.name != 'android') {
	win.setToolbar([flexSpace,pb,flexSpace]);
}
pb.show();

//
// INTERVAL TO UPDATE PB
//
var i = setInterval(function()
{
	if (sound.isPlaying())
	{
		Ti.API.info('time ' + sound.time);
		pb.value = sound.time;

	}
},500);

//
//  CLOSE EVENT - CANCEL INTERVAL
//
win.addEventListener('close', function()
{
	clearInterval(i);
});