(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/database_2.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "database_2.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var db = Ti.Database.open('mydb');
db.execute('INSERT INTO DATABASETEST (ID, NAME ) VALUES(?,?)',5,'Name 5');
db.execute('INSERT INTO DATABASETEST (ID, NAME ) VALUES(?,?)',6,'Name 6');
db.execute('INSERT INTO DATABASETEST (ID, NAME ) VALUES(?,?)',7,'Name 7');
db.execute('INSERT INTO DATABASETEST (ID, NAME ) VALUES(?,?)',8,'Name 8');

Ti.API.info('JUST INSERTED, rowsAffected = ' + db.rowsAffected);
Ti.API.info('JUST INSERTED, lastInsertRowId = ' + db.lastInsertRowId);

var rows = db.execute('SELECT * FROM DATABASETEST');
Ti.API.info('ROW COUNT = ' + rows.getRowCount());

while (rows.isValidRow())
{
	Ti.API.info('ID: ' + rows.field(0) + ' NAME: ' + rows.fieldByName('name'));
	rows.next();
}
rows.close();
db.close();  // close db when you're done to save resources

Ti.UI.currentWindow.addEventListener('click',function(e){Ti.UI.currentWindow.close();});