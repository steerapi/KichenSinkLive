(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/database_2.js");
  text = (file.read()).text
  xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: text,
    file: "database_2.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var db = Titanium.Database.open('mydb');
db.execute('INSERT INTO DATABASETEST (ID, NAME ) VALUES(?,?)',5,'Name 5');
db.execute('INSERT INTO DATABASETEST (ID, NAME ) VALUES(?,?)',6,'Name 6');
db.execute('INSERT INTO DATABASETEST (ID, NAME ) VALUES(?,?)',7,'Name 7');
db.execute('INSERT INTO DATABASETEST (ID, NAME ) VALUES(?,?)',8,'Name 8');

Titanium.API.info('JUST INSERTED, rowsAffected = ' + db.rowsAffected);
Titanium.API.info('JUST INSERTED, lastInsertRowId = ' + db.lastInsertRowId);

var rows = db.execute('SELECT * FROM DATABASETEST');
Titanium.API.info('ROW COUNT = ' + rows.getRowCount());

while (rows.isValidRow())
{
	Titanium.API.info('ID: ' + rows.field(0) + ' NAME: ' + rows.fieldByName('name'));
	rows.next();
}
rows.close();
db.close();  // close db when you're done to save resources

Ti.UI.currentWindow.addEventListener('click',function(e){Titanium.UI.currentWindow.close();});
