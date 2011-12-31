(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile("examples/xml_rss.js");
  xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "xml_rss.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------

// create table view data object
var data = [];

var xhr = Ti.Network.createHTTPClient();
xhr.open("GET","http://v2.0.news.tmg.s3.amazonaws.com/feeds/news.xml");
xhr.onload = function()
{
	try
	{
		var doc = this.responseXML.documentElement;
		var items = doc.getElementsByTagName("item");
		var x = 0;
		var doctitle = doc.evaluate("//channel/title/text()").item(0).nodeValue;
		for (var c=0;c<items.length;c++)
		{
			var item = items.item(c);
			var thumbnails = item.getElementsByTagName("media:thumbnail");
			if (thumbnails && thumbnails.length > 0)
			{
				var media = thumbnails.item(0).getAttribute("url");
				var title = item.getElementsByTagName("title").item(0).text;
				var row = Ti.UI.createTableViewRow({height:80});
				var label = Ti.UI.createLabel({
					text:title,
					left:72,
					top:5,
					bottom:5,
					right:5				
				});
				row.add(label);
				var img;
				if (Titanium.Platform.name == 'android') 
				{
					// iphone moved to a single image property - android needs to do the same
					img = Ti.UI.createImageView({
						image:media,
						left:5,
						height:60,
						width:60
					});

				}
				else
				{
					img = Ti.UI.createImageView({
						image:media,
						left:5,
						height:60,
						width:60
					});
					
				}
				row.add(img);
				data[x++] = row;
				row.url = item.getElementsByTagName("link").item(0).text;
			}
		}
		var tableview = Titanium.UI.createTableView({data:data});
		Titanium.UI.currentWindow.add(tableview);
		tableview.addEventListener('click',function(e)
		{
			var w = Ti.UI.createWindow({title:doctitle});
			var wb = Ti.UI.createWebView({url:e.row.url});
			w.add(wb);
			var b = Titanium.UI.createButton({
				title:'Close',
				style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
			});
			w.setLeftNavButton(b);
			b.addEventListener('click',function()
			{
				w.close();
			});
			w.open({modal:true});
		});
	}
	catch(E)
	{
		alert(E);
	}
};
xhr.send();




