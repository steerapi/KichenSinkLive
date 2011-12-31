(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/contacts_remove.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "contacts_remove.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------

var win = Ti.UI.currentWindow;

var b1 = Ti.UI.createButton({
	title:'Delete via picker',
	width:200,
	height:40
});
b1.addEventListener('click', function() {
	Ti.Contacts.showContacts({
		selectedPerson:function(e) {
			Ti.Contacts.removePerson(e.person);
			Ti.Contacts.save();
		}
	});
});
win.add(b1);