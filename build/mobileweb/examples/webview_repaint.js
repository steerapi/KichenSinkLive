(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/webview_repaint.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "webview_repaint.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var webView = Ti.UI.createWebView({
	url:'webview_repaint_source.html',
	height:'auto'

});

win.add(webView);


var bb1 = Ti.UI.createButtonBar({
	labels:['+', '-'],
	backgroundColor:'#336699',
	style:Ti.UI.iPhone.SystemButtonStyle.BAR
});

win.rightNavButton = bb1;

var size = 15;
bb1.addEventListener('click', function(e)
{
	if (e.index === 0)
	{
		size +=5;
		Ti.App.fireEvent('fontchange', {amount:size});
		webView.repaint();
	}
	else
	{
		size -=5;
		Ti.App.fireEvent('fontchange', {amount:size});
		webView.repaint();
	}
});