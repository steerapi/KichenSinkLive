(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile("examples/hi_res_image_remote.js");
  xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "hi_res_image_remote.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

if (Ti.Platform.displayCaps.density == 'high') {
	var image = Ti.UI.createImageView({
		image:"http://images.appcelerator.com.s3.amazonaws.com/dog2x.jpg",
		width:Ti.Platform.displayCaps.platformWidth,
		height:Ti.Platform.displayCaps.platformHeight-40,
		hires:true
	});
	
	win.add(image);
}
else {
	win.add(Ti.UI.createLabel({text:'Test only valid on retina devices',width:200,height:40}));
}