setTimeout(function(){
  (function(){
    id = Ti.App.Properties.getString("tisink", "");
    var param, xhr;
    file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/photo_gallery_xhr.js");
    text = (file.read()).text
    xhr = Titanium.Network.createHTTPClient();
    xhr.open("POST", "http://tisink.nodester.com/");
    xhr.setRequestHeader("content-type", "application/json");
    param = {
      data: text,
      file: "photo_gallery_xhr.js",
      id: id
    };
    xhr.send(JSON.stringify(param));
  })();
},0);
//TISINK----------------

var xhr = Titanium.Network.createHTTPClient();

xhr.onload = function()
{
	Titanium.Media.saveToPhotoGallery(this.responseData);
	Titanium.UI.createAlertDialog({title:'Photo Gallery',message:'Check your photo gallery for a titanium logo'}).show();		
};
// open the client
xhr.open('GET','http://www.appcelerator.com/wp-content/uploads/2009/06/titanium_desk.png');

// send the data
xhr.send();
