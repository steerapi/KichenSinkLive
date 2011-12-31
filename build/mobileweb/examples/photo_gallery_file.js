(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/photo_gallery_file.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "photo_gallery_file.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'images/appcelerator_small.png');

Ti.Media.saveToPhotoGallery(f,{
	success: function(e) {
		Ti.UI.createAlertDialog({
			title:'Photo Gallery',
			message:'Check your photo gallery for an appcelerator logo'
		}).show();		
	},
	error: function(e) {
		Ti.UI.createAlertDialog({
			title:'Error saving',
			message:e.error
		}).show();
	}
});

;