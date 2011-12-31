(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/database_3.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "database_3.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var db = Ti.Database.install('../testdb.db','quotes');

var rows = db.execute('SELECT * FROM TIPS');
db.execute('UPDATE TIPS SET TITLE="UPDATED TITLE" WHERE TITLE = "FOO"');
db.execute('INSERT INTO TIPS VALUES("FOO", "BAR")');

//db.execute("COMMIT");
while (rows.isValidRow())
{
	Ti.API.info(rows.field(1) + '\n' + rows.field(0) + ' col 1 ' + rows.fieldName(0) + ' col 2 ' + rows.fieldName(1));
	rows.next();
}

// close database
rows.close();

Ti.UI.currentWindow.addEventListener('click',function(e){Ti.UI.currentWindow.close();});