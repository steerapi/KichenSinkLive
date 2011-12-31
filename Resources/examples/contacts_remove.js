(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/contacts_remove.js");
  text = (file.read()).text
  xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: text,
    file: "contacts_remove.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------

var win = Titanium.UI.currentWindow;

var b1 = Ti.UI.createButton({
	title:'Delete via picker',
	width:200,
	height:40
});
b1.addEventListener('click', function() {
	Titanium.Contacts.showContacts({
		selectedPerson:function(e) {
			Titanium.Contacts.removePerson(e.person);
			Titanium.Contacts.save();
		}
	});
});
win.add(b1);