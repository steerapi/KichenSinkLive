setTimeout(function(){
  (function(){
    id = Ti.App.Properties.getString("tisink", "");
    var param, xhr;
    file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/js_include.js");
    text = (file.read()).text
    xhr = Titanium.Network.createHTTPClient();
    xhr.open("POST", "http://tisink.nodester.com/");
    xhr.setRequestHeader("content-type", "application/json");
    param = {
      data: text,
      file: "js_include.js",
      id: id
    };
    xhr.send(JSON.stringify(param));
  })();
},0);
//TISINK----------------

Titanium.include('../my_js_include.js', '../my_js_include_2.js', 'local_include.js');

Ti.UI.createAlertDialog({
	title:'JS Includes',
	message:'first name: ' + myFirstName + ' middle name: ' + myMiddleName +' last name: ' + myLastName
}).show();
