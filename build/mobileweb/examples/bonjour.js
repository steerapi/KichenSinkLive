(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/bonjour.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "bonjour.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
// Publish a local service on startup
var bonjourSocket = Ti.Network.createTCPSocket({
	hostName:Ti.Network.INADDR_ANY,
	port:40401,
	mode:Ti.Network.READ_WRITE_MODE
});

bonjourSocket.addEventListener('read', function(e) {
	var remoteSocket = e['from'];
	var dataStr = e['data'].text;
	if (dataStr == 'req') {
		bonjourSocket.write('Hello, from '+Ti.Platform.id, remoteSocket);
	}
	else {
		Ti.UI.createAlertDialog({
			title:'Unknown listener message...',
			message:dataStr
		}).show();

		// WARNING: There's some weird issue here where data events may or may
		// not interact with UI update events (including logging) and this
		// may result in some very ugly undefined behavior... that hasn't been
		// detected before because only UI elements have fired events in the
		// past.
		//
		// Unfortunately, Bonjour is completely asynchronous and requires event
		// firing: Sockets require it as well to reliably deliver information
		// about when new data is available.
		//
		// In particular if UI elements are updated 'out of order' with socket
		// data (especially modal elements, like dialogs, from inside the callback)
		// there may be some very bad results.  Like... crashes.
	}
});
bonjourSocket.listen();

var localService = Ti.Network.createBonjourService({
	name:'Bonjour Test: '+Ti.Platform.id,
	type:'_utest._tcp',
	domain:'local.'
});

try
{
	localService.publish(bonjourSocket);
}
catch (e) {
	Ti.UI.createAlertDialog({
		title:'Error!',
		message:e
	}).show();
}

// Searcher for finding other services
var serviceBrowser = Ti.Network.createBonjourBrowser({
	serviceType:'_utest._tcp',
	domain:'local.'
});

var tableView = Ti.UI.createTableView({
	style:Ti.UI.iPhone.TableViewStyle.GROUPED,
	data:[{title:'No services', hasChild:false}]
});

tableView.addEventListener('click', function(r) {
	var service = r['rowData'].service;
	service.socket.write('req');
});

var services = null;
updateUI = function(e) {
	var data = [];
	services = e['services'];

	for (var i=0; i < services.length; i++) {
		var service = services[i];
		var row = Ti.UI.createTableViewRow({
			title:service.name,
			service:service
		});

		if (service.socket == null || !service.socket.isValid) {
			service.resolve();
			service.socket.addEventListener('read', function(x) {
				Ti.UI.createAlertDialog({
					title:'Bonjour message!',
					message:x['data'].text
				}).show();
			});
			service.socket.connect();
		}

		data.push(row);
	}

	if (data.length === 0) {
		data.push(Ti.UI.createTableViewRow({
			title:'No services'
		}));
	}

	tableView.setData(data);
};

serviceBrowser.addEventListener('updatedServices', updateUI);

// Cleanup
Ti.UI.currentWindow.addEventListener('close', function(e) {
	if (serviceBrowser.isSearching) {
		serviceBrowser.stopSearch();
	}
	Ti.API.info('Stopped search...');
	localService.stop();
	Ti.API.info('Stopped service...');
	if (bonjourSocket.isValid) {
		bonjourSocket.close();
	}
	Ti.API.info('Closed socket...');
	for (var i=0; i < services.length; i++) {
		var service = services[i];
		if (service.socket.isValid) {
			service.socket.close();
		}
		Ti.API.info('Closed socket to service '+service.name+"...");
	}
});

serviceBrowser.search();
Ti.UI.currentWindow.add(tableView);