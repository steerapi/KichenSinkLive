(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/js_include.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "js_include.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
Ti.include('../my_js_include.js', '../my_js_include_2.js', 'local_include.js');

Ti.UI.createAlertDialog({
	title:'JS Includes',
	message:'first name: ' + myFirstName + ' middle name: ' + myMiddleName +' last name: ' + myLastName
}).show();