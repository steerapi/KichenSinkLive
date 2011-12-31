(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/searchbar.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "searchbar.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var search = Ti.UI.createSearchBar({
	barColor:'#000',
	showCancel:true,
	height:43,
	top:0
});

win.add(search);

// dynamically set value
search.value = 'foo';

//
// FOCUS
//
var b1 = Ti.UI.createButton({
	title:'Focus Search Bar',
	height:40,
	width:200,
	top:60
});
win.add(b1);
b1.addEventListener('click', function()
{
	search.focus();
});

//
// BLUR
//
var b2 = Ti.UI.createButton({
	title:'Blur Search Bar',
	height:40,
	width:200,
	top:110
});
win.add(b2);
b2.addEventListener('click', function()
{
	search.blur();
});

//
// TOGGLE CANCEL BUTTON
//
var b3 = Ti.UI.createButton({
	title:'Toggle Cancel',
	height:40,
	width:200,
	top:160
});
win.add(b3);
b3.addEventListener('click', function()
{
	search.showCancel = (search.showCancel === true)?false:true;
});

//
// CHANGE THE VALUE
//
var b4 = Ti.UI.createButton({
	title:'Change Value',
	height:40,
	width:200,
	top:210
});
win.add(b4);
b4.addEventListener('click', function()
{
	search.value = 'I have changed';
});

//
// HIDE/SHOW
//
var b5 = Ti.UI.createButton({
	title:'Hide/Show',
	height:40,
	width:200,
	top:260
});
win.add(b5);
var visible = true;
b5.addEventListener('click', function()
{
	if (!visible)
	{
		search.show();
		visible=true;
	}
	else
	{
		search.hide();
		visible=false;
	}
});

//
// SEARCH BAR EVENTS
//
search.addEventListener('change', function(e)
{
	Ti.API.info('search bar: you type ' + e.value + ' act val ' + search.value);

});
search.addEventListener('cancel', function(e)
{
	Ti.API.info('search bar cancel fired');
	search.blur();
});
search.addEventListener('return', function(e)
{
	Ti.UI.createAlertDialog({title:'Search Bar', message:'You typed ' + e.value }).show();
	search.blur();
});
search.addEventListener('focus', function(e)
{
	Ti.API.info('search bar: focus received');
});
search.addEventListener('blur', function(e)
{
	Ti.API.info('search bar:blur received');
});