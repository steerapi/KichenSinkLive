(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/photo_gallery_bgimage.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "photo_gallery_bgimage.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var f = Ti.App.Properties.getString("filename");
var bgImage = null;
if (f != null)
{
	bgImage	= Ti.Filesystem.getFile(f);
	win.backgroundImage = bgImage.nativePath;
	
}

var add = Ti.UI.createButton({top:20,width:200,height:40, title:'Select Image'});
win.add(add);
	
add.addEventListener('click',function()
{		
	Ti.Media.openPhotoGallery(
	{	
		success:function(event)
		{
			var image = event.media;
			
			// create new file name and remove old
			var filename = Ti.Filesystem.applicationDataDirectory + "/" + new Date().getTime() + ".jpg";
			Ti.App.Properties.setString("filename", filename);
			if (bgImage != null)
			{
				bgImage.deleteFile();
			}
			bgImage = Ti.Filesystem.getFile(filename);
			bgImage.write(image);
			
			win.backgroundImage = null;
			win.backgroundImage = bgImage.nativePath;	
		},
		cancel:function()
		{
	
		},
		error:function(error)
		{
		}
	});
});