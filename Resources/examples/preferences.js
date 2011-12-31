(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/preferences.js");
  text = (file.read()).text
  xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: text,
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
// Titanium.UI.Android.openPreferences() will simply
// do nothing.

var btn = Titanium.UI.createButton({
	title:	'Click to Open Preferences'
});
btn.addEventListener('click', function() {
	Titanium.UI.Android.openPreferences();
});
Titanium.UI.currentWindow.add(btn);
