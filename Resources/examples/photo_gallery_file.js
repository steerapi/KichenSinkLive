(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/photo_gallery_file.js");
  text = (file.read()).text
  xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: text,
    file: "photo_gallery_file.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var f = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,'images/appcelerator_small.png');

Titanium.Media.saveToPhotoGallery(f,{
	success: function(e) {
		Titanium.UI.createAlertDialog({
			title:'Photo Gallery',
			message:'Check your photo gallery for an appcelerator logo'
		}).show();		
	},
	error: function(e) {
		Titanium.UI.createAlertDialog({
			title:'Error saving',
			message:e.error
		}).show();
	}
});

