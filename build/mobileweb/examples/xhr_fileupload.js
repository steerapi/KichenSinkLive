(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/xhr_fileupload.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "xhr_fileupload.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var ind=Ti.UI.createProgressBar({
	width:200,
	height:50,
	min:0,
	max:1,
	value:0,
	style:Ti.UI.iPhone.ProgressBarStyle.PLAIN,
	top:10,
	message:'Uploading Image',
	font:{fontSize:12, fontWeight:'bold'},
	color:'#888'
});

win.add(ind);
ind.show();

Ti.Media.openPhotoGallery({

	success:function(event)
	{
		Ti.API.info("success! event: " + JSON.stringify(event));
		var image = event.media;
	
		var xhr = Ti.Network.createHTTPClient();

		xhr.onerror = function(e)
		{
			Ti.UI.createAlertDialog({title:'Error', message:e.error}).show();
			Ti.API.info('IN ERROR ' + e.error);
		};
		xhr.setTimeout(20000);
		xhr.onload = function(e)
		{
			Ti.UI.createAlertDialog({title:'Success', message:'status code ' + this.status}).show();
			Ti.API.info('IN ONLOAD ' + this.status + ' readyState ' + this.readyState);
		};
		xhr.onsendstream = function(e)
		{
			ind.value = e.progress ;
			Ti.API.info('ONSENDSTREAM - PROGRESS: ' + e.progress);
		};
		// open the client
		xhr.open('POST','https://twitpic.com/api/uploadAndPost');

		// send the data
		xhr.send({media:image,username:'fgsandford1000',password:'sanford1000',message:'check me out'});
		
	},
	cancel:function()
	{

	},
	error:function(error)
	{
	},
	allowEditing:true
});