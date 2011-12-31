(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/image_view_encoding.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "image_view_encoding.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

// this is a remote URL with a UTF-8 character encoded. We should be able
// to fetch this image OK

var test_img = Ti.UI.createImageView({
		image: 'http://www.zoomout.gr/assets/media/PICTURES/' + encodeURIComponent('ΜΟΥΣΙΚΗ') + '/651_thumb1.jpg'

}); 

win.add(test_img);

;