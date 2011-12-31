(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/preferences.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "preferences.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
// See:
//	platform/android/res/xml/preferences.xml
//	platform/android/res/values/array.xml
// Similar files MUST be present at build time or
// Ti.UI.Android.openPreferences() will simply
// do nothing.

var btn = Ti.UI.createButton({
	title:	'Click to Open Preferences'
});
btn.addEventListener('click', function() {
	Ti.UI.Android.openPreferences();
});
Ti.UI.currentWindow.add(btn);