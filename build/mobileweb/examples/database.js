(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/database.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "database.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var l = Ti.UI.createLabel({
	text:'See Log for output',
	top:10,
	left:10,
	height:'auto',
	width:'auto'
});
win.add(l);

var b1 = Ti.UI.createButton({
	title:'DB in 2nd Context',
	width:200,
	height:40,
	top:40
});
win.add(b1);

b1.addEventListener('click', function()
{
	var win1 = Ti.UI.createWindow({
		url:'database_2.js',
		height:30,
		width:280,
		borderRadius:10,
		bottom:80,
		backgroundColor:'#333'
	});
	var l1 = Ti.UI.createLabel({
		text:'2nd context test - see log.',
		color:'#fff',
		font:{fontSize:14},
		width:'auto',
		height:'auto'
	});
	win1.add(l1);
	win1.open();
});

var b2 = Ti.UI.createButton({
	title:'Pre-packaged DB',
	width:200,
	height:40,
	top:100
});
win.add(b2);

b2.addEventListener('click', function()
{
	var win2 = Ti.UI.createWindow({
		url:'database_3.js',
		height:30,
		width:280,
		borderRadius:10,
		bottom:140,
		backgroundColor:'#333'
	});
	var l2= Ti.UI.createLabel({
		text:'Pre-packaged Db - see log.',
		color:'#fff',
		font:{fontSize:14},
		width:'auto',
		height:'auto'
	});
	win2.add(l2);
	win2.open();
	
});
var l3 = Ti.UI.createLabel({
	text:'unicode placeholder',
	width:300,
	height:40,
	top:190
});
win.add(l3);
if (Ti.Platform.osname !== 'android')
{
	win.add(l3);
		var b3 = Ti.UI.createButton({
		title:'Check DB FullPath',
		width:200,
		height:40,
		top:150
	});
	b3.addEventListener('click', function()
	{
		var path = db.file;
		alert("mysql.db fullpath : \n \nType :" + path +"\n\nFullPath: "+path.nativePath);	
	});
	win.add(b3);
}
var db = Ti.Database.open('mydb');

db.execute('CREATE TABLE IF NOT EXISTS DATABASETEST  (ID INTEGER, NAME TEXT)');
db.execute('DELETE FROM DATABASETEST');

db.execute('INSERT INTO DATABASETEST (ID, NAME ) VALUES(?,?)',1,'Name 1');
db.execute('INSERT INTO DATABASETEST (ID, NAME ) VALUES(?,?)',2,'Name 2');
db.execute('INSERT INTO DATABASETEST (ID, NAME ) VALUES(?,?)',3,'Name 3');
db.execute('INSERT INTO DATABASETEST (ID, NAME ) VALUES(?,?)',4,'Name 4');
db.execute('INSERT INTO DATABASETEST (ID, NAME ) VALUES(?,?)', 5, '\u2070 \u00B9 \u00B2 \u00B3 \u2074 \u2075 \u2076 \u2077 \u2078 \u2079');
var updateName = 'I was updated';
var updateId = 4;
db.execute('UPDATE DATABASETEST SET NAME = ? WHERE ID = ?', updateName, updateId);

db.execute('UPDATE DATABASETEST SET NAME = "I was updated too" WHERE ID = 2');

db.execute('DELETE FROM DATABASETEST WHERE ID = ?',1);

Ti.API.info('JUST INSERTED, rowsAffected = ' + db.rowsAffected);
Ti.API.info('JUST INSERTED, lastInsertRowId = ' + db.lastInsertRowId);

var rows = db.execute('SELECT * FROM DATABASETEST');
Ti.API.info('ROW COUNT = ' + rows.getRowCount());
Ti.API.info('ROW COUNT = ' + rows.getRowCount());
Ti.API.info('ROW COUNT = ' + rows.getRowCount());

while (rows.isValidRow())
{
	Ti.API.info('ID: ' + rows.field(0) + ' NAME: ' + rows.fieldByName('name') + ' COLUMN NAME ' + rows.fieldName(0));
	if (rows.field(0)==5)
	{
		l3.text = rows.fieldByName('name');
	}

	rows.next();
}
rows.close();
db.close(); // close db when you're done to save resources;