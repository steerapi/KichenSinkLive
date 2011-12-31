(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/system_buttons.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "system_buttons.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

// used to evenly distribute items on the toolbar
var flexSpace = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});

// used to create a fixed amount of space between two items on the toolbar
var fixedSpace = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.FIXED_SPACE,
	width:50
});

// system buttons
var action = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.ACTION
});
action.addEventListener('click', function()
{
	Ti.UI.createAlertDialog({title:'System Button', message:'ACTION'}).show();
});

var camera = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.CAMERA
});
camera.addEventListener('click', function()
{
	Ti.UI.createAlertDialog({title:'System Button', message:'CAMERA'}).show();
});

var compose = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.COMPOSE
});
compose.addEventListener('click', function()
{
	Ti.UI.createAlertDialog({title:'System Button', message:'COMPOSE'}).show();
});

var bookmarks = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.BOOKMARKS
});
bookmarks.addEventListener('click', function()
{
	Ti.UI.createAlertDialog({title:'System Button', message:'BOOKMARKS'}).show();
});

var search = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.SEARCH
});
search.addEventListener('click', function()
{
	Ti.UI.createAlertDialog({title:'System Button', message:'SEARCH'}).show();
});

var add = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.ADD
});
add.addEventListener('click', function()
{
	Ti.UI.createAlertDialog({title:'System Button', message:'ADD'}).show();
});

var trash = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.TRASH
});
trash.addEventListener('click', function()
{
	Ti.UI.createAlertDialog({title:'System Button', message:'TRASH'}).show();
});

var reply = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.REPLY
});
reply.addEventListener('click', function()
{
	Ti.UI.createAlertDialog({title:'System Button', message:'REPLY'}).show();
});

var stop = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.STOP
});
stop.addEventListener('click', function()
{
	Ti.UI.createAlertDialog({title:'System Button', message:'STOP'}).show();
});

var refresh = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.REFRESH
});
refresh.addEventListener('click', function()
{
	Ti.UI.createAlertDialog({title:'System Button', message:'REFRESH'}).show();
});

var play = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.PLAY
});
play.addEventListener('click', function()
{
	Ti.UI.createAlertDialog({title:'System Button', message:'PLAY'}).show();
});

var pause = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.PAUSE
});
pause.addEventListener('click', function()
{
	Ti.UI.createAlertDialog({title:'System Button', message:'PAUSE'}).show();
});

var fastforward = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.FAST_FORWARD
});
fastforward.addEventListener('click', function()
{
	Ti.UI.createAlertDialog({title:'System Button', message:'FAST_FORWARD'}).show();
});

var rewind = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.REWIND
});
rewind.addEventListener('click', function()
{
	Ti.UI.createAlertDialog({title:'System Button', message:'REWIND'}).show();
});

var edit = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.EDIT
});
edit.addEventListener('click', function()
{
	Ti.UI.createAlertDialog({title:'System Button', message:'EDIT'}).show();
});

var cancel = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.CANCEL
});
cancel.addEventListener('click', function()
{
	Ti.UI.createAlertDialog({title:'System Button', message:'CANCEL'}).show();
});

var save = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.SAVE
});
save.addEventListener('click', function()
{
	Ti.UI.createAlertDialog({title:'System Button', message:'SAVE'}).show();
});

var organize = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.ORGANIZE
});
organize.addEventListener('click', function()
{
	Ti.UI.createAlertDialog({title:'System Button', message:'ORGANIZE'}).show();
});

var done = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.DONE
});
done.addEventListener('click', function()
{
	Ti.UI.createAlertDialog({title:'System Button', message:'DONE'}).show();
});

var disclosure = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.DISCLOSURE
});
disclosure.addEventListener('click', function()
{
	Ti.API.info('FOO');
	Ti.UI.createAlertDialog({title:'System Button', message:'DISCLOSURE'}).show();
});

var contactadd = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.CONTACT_ADD
});
contactadd.addEventListener('click', function()
{
	Ti.UI.createAlertDialog({title:'System Button', message:'CONTACT_ADD'}).show();
});

var nativespinner = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.SPINNER
});
nativespinner.addEventListener('click', function()
{
	Ti.UI.createAlertDialog({title:'System Button', message:'SPINNER'}).show();
});

var infolight = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.INFO_LIGHT
});
infolight.addEventListener('click', function()
{
	Ti.UI.createAlertDialog({title:'System Button', message:'INFO_LIGHT'}).show();
});

var infodark = Ti.UI.createButton({
	systemButton:Ti.UI.iPhone.SystemButton.INFO_DARK
});
infodark.addEventListener('click', function()
{
	Ti.UI.createAlertDialog({title:'System Button', message:'INFO_DARK'}).show();
});

//
// CREATE BUTTONS TO CHANGE VIEW
//
var b = Ti.UI.createButton({
	title:'Set Button Group 1',
	width:200,
	height:40,
	top:10
});

b.addEventListener('click', function()
{
	win.rightNavButton = camera;
	win.toolbar = [action,flexSpace,compose,fixedSpace,bookmarks,flexSpace,search];
});
win.add(b);

var b2 = Ti.UI.createButton({
	title:'Set Button Group 2',
	width:200,
	height:40,
	top:60
});

b2.addEventListener('click', function()
{
	win.rightNavButton = add;
	win.toolbar = [trash,flexSpace,reply,fixedSpace,stop,flexSpace,refresh];
});
win.add(b2);

var b3 = Ti.UI.createButton({
	title:'Set Button Group 3',
	width:200,
	height:40,
	top:110
});

b3.addEventListener('click', function()
{
	win.rightNavButton = play;
	win.toolbar = [pause,flexSpace,fastforward,fixedSpace,rewind,flexSpace,edit];
});
win.add(b3);

var b4 = Ti.UI.createButton({
	title:'Set Button Group 4',
	width:200,
	height:40,
	top:160
});

b4.addEventListener('click', function()
{
	win.rightNavButton = cancel;
	win.toolbar = [save,flexSpace,organize,fixedSpace,done,flexSpace,disclosure];
});
win.add(b4);

var b5 = Ti.UI.createButton({
	title:'Set Button Group 5',
	width:200,
	height:40,
	top:210
});

b5.addEventListener('click', function()
{
	win.rightNavButton = contactadd;
	win.toolbar = [nativespinner,flexSpace,infolight,flexSpace,infodark];
});
win.add(b5);

;