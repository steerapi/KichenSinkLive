(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/photo_gallery_xhr.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "photo_gallery_xhr.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var xhr = Ti.Network.createHTTPClient();

xhr.onload = function()
{
	Ti.Media.saveToPhotoGallery(this.responseData);
	Ti.UI.createAlertDialog({title:'Photo Gallery',message:'Check your photo gallery for a titanium logo'}).show();		
};
// open the client
xhr.open('GET','http://www.appcelerator.com/wp-content/uploads/2009/06/titanium_desk.png');

// send the data
xhr.send();