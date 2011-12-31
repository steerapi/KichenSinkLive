(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/sound.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "sound.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
// create table view data object
var data = [
	{title:'Local', hasChild:true, test:'../examples/sound_local.js'},
	{title:'Local with File', hasChild:true, test:'../examples/sound_file.js'},
	{title:'Local with File URL', hasChild:true, test:'../examples/sound_file_url.js'},
	{title:'Remote URL', hasChild:true, test:'../examples/sound_remote_url.js'},
	{title:'Remote Streaming', hasChild:true, test:'../examples/sound_remote.js'}

];

if (Ti.Platform.name == 'iPhone OS')
{
	data.push({title:'Record', hasChild:true, test:'../examples/sound_record.js'});
	data.push({title:'Audio Session Mode', hasChild:true, test:'../examples/sound_session_mode.js'});
	
	Ti.include("version.js");
	
	if (isiOS4Plus())
	{
		data.push({title:'Background Audio', hasChild:true, test:'../examples/sound_bg.js'});
	}
}

// create table view
var tableview = Ti.UI.createTableView({
	data:data
});

// create table view event listener
tableview.addEventListener('click', function(e)
{
	if (e.rowData.test)
	{
		var win = Ti.UI.createWindow({
			url:e.rowData.test,
			title:e.rowData.title
		});
		Ti.UI.currentTab.open(win,{animated:true});
	}
});

// add table view to the window
Ti.UI.currentWindow.add(tableview);