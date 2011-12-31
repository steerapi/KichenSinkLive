(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile("examples/photo_gallery.js");
  xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "photo_gallery.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Titanium.UI.currentWindow;

var imageView = Titanium.UI.createImageView({
	height:200,
	width:200,
	top:20,
	left:10,
	backgroundColor:'#999'
});

win.add(imageView);

var popoverView;
var arrowDirection;

if (Titanium.Platform.osname == 'ipad')
{
	// photogallery displays in a popover on the ipad and we
	// want to make it relative to our image with a left arrow
	arrowDirection = Ti.UI.iPad.POPOVER_ARROW_DIRECTION_LEFT;
	popoverView = imageView;
}

Titanium.Media.openPhotoGallery({

	success:function(event)
	{
		var cropRect = event.cropRect;
		var image = event.media;

		// set image view
		Ti.API.debug('Our type was: '+event.mediaType);
		if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
		{
			imageView.image = image;
		}
		else
		{
			// is this necessary?
		}

		Titanium.API.info('PHOTO GALLERY SUCCESS cropRect.x ' + cropRect.x + ' cropRect.y ' + cropRect.y  + ' cropRect.height ' + cropRect.height + ' cropRect.width ' + cropRect.width);

	},
	cancel:function()
	{

	},
	error:function(error)
	{
	},
	allowEditing:true,
	popoverView:popoverView,
	arrowDirection:arrowDirection,
	mediaTypes:[Ti.Media.MEDIA_TYPE_VIDEO,Ti.Media.MEDIA_TYPE_PHOTO]
});
