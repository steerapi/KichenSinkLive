(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/database_3.js");
  text = (file.read()).text
  xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: text,
    file: "database_3.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var db = Titanium.Database.install('../testdb.db','quotes');

var rows = db.execute('SELECT * FROM TIPS');
db.execute('UPDATE TIPS SET TITLE="UPDATED TITLE" WHERE TITLE = "FOO"');
db.execute('INSERT INTO TIPS VALUES("FOO", "BAR")');

//db.execute("COMMIT");
while (rows.isValidRow())
{
	Titanium.API.info(rows.field(1) + '\n' + rows.field(0) + ' col 1 ' + rows.fieldName(0) + ' col 2 ' + rows.fieldName(1));
	rows.next();
}

// close database
rows.close();

Ti.UI.currentWindow.addEventListener('click',function(e){Titanium.UI.currentWindow.close();});
