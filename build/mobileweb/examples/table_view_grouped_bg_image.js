(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/table_view_grouped_bg_image.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "table_view_grouped_bg_image.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;
win.backgroundImage = '../images/tableview/brown_bg_482.png';


// data for tableview
var data = [

	{title:'Play Movie',backgroundImage:'../images/tableview/off_1.png',
			selectedBackgroundImage:'../images/tableview/on_1.png', leftImage: '../images/tableview/phone_playmovie.png'},

	{title:'Camera',backgroundImage:'../images/tableview/off_2.png',
			selectedBackgroundImage:'../images/tableview/on_2.png', leftImage: '../images/tableview/phone_camera.png'},

	{title:'Vibrate',backgroundImage:'../images/tableview/off_3.png',
			selectedBackgroundImage:'../images/tableview/on_3.png', leftImage: '../images/tableview/phone_vibrate.png'},

	{title:'Orientation',backgroundImage:'../images/tableview/off_4.png',
		selectedBackgroundImage:'../images/tableview/on_4.png', leftImage: '../images/tableview/phone_orientation.png'},

	{title:'Photo Gallery',backgroundImage:'../images/tableview/off_1.png',
			selectedBackgroundImage:'../images/tableview/on_1.png', leftImage: '../images/tableview/phone_photogallery.png'},

	{title:'Geo Location',backgroundImage:'../images/tableview/off_2.png',
			selectedBackgroundImage:'../images/tableview/on_2.png', leftImage: '../images/tableview/phone_geoloc.png'},

	{title:'Accelerometer',backgroundImage:'../images/tableview/off_3.png',
			selectedBackgroundImage:'../images/tableview/on_3.png', leftImage: '../images/tableview/phone_accelerometer.png'},

	{title:'Sound',backgroundImage:'../images/tableview/off_4.png',
			selectedBackgroundImage:'../images/tableview/on_4.png', leftImage: '../images/tableview/phone_sound.png'},

	{title:'Shake',backgroundImage:'../images/tableview/off_1.png',
			selectedBackgroundImage:'../images/tableview/on_1.png', leftImage: '../images/tableview/phone_shake.png'},

	{title:'Email Client',backgroundImage:'../images/tableview/off_2.png',
			selectedBackgroundImage:'../images/tableview/on_2.png', leftImage: '../images/tableview/phone_email.png'},

	{title:'Save to Gallery',backgroundImage:'../images/tableview/off_3.png',
			selectedBackgroundImage:'../images/tableview/on_3.png', leftImage: '../images/tableview/phone_savetogallery.png'},

	{title:'Contacts',backgroundImage:'../images/tableview/off_4.png',
			 selectedBackgroundImage:'../images/tableview/on_4.png', leftImage: '../images/tableview/phone_contact.png'}
];

// tableview object
var tableView = Ti.UI.createTableView({
	width:300,
	backgroundColor:'transparent',
	data:data,
	separatorStyle:Ti.UI.iPhone.TableViewSeparatorStyle.NONE,
	top:10,
	style: Ti.UI.iPhone.TableViewStyle.GROUPED
	

});

win.add(tableView);