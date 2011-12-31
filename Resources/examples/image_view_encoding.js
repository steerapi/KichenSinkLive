setTimeout(function(){
  (function(){
    id = Ti.App.Properties.getString("tisink", "");
    var param, xhr;
    file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/image_view_encoding.js");
    text = (file.read()).text
    xhr = Titanium.Network.createHTTPClient();
    xhr.open("POST", "http://tisink.nodester.com/");
    xhr.setRequestHeader("content-type", "application/json");
    param = {
      data: text,
      file: "image_view_encoding.js",
      id: id
    };
    xhr.send(JSON.stringify(param));
  })();
},0);
//TISINK----------------

var win = Ti.UI.currentWindow;

// this is a remote URL with a UTF-8 character encoded. We should be able
// to fetch this image OK

var test_img = Titanium.UI.createImageView({
		image: 'http://www.zoomout.gr/assets/media/PICTURES/' + encodeURIComponent('ΜΟΥΣΙΚΗ') + '/651_thumb1.jpg'

}); 

win.add(test_img);

