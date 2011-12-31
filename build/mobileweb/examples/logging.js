(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/logging.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "logging.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win= Ti.UI.currentWindow;

var l = Ti.UI.createLabel({
	text:'Check the log for output',
	width:'auto',
	height:'auto'
});

win.add(l);

// define an object
var obj = {name:'foo', value:'bar'};

Ti.API.log('ERROR','ERROR MESSAGE FROM FUNCTION - name: ' + obj.name + ' value: ' + obj.value);
Ti.API.debug('DEBUG MESSAGE FROM FUNCTION - name: ' + obj.name + ' value: ' + obj.value);
Ti.API.error('ERROR MESSAGE FROM FUNCTION - name: ' + obj.name + ' value: ' + obj.value);
Ti.API.warn('WARN MESSAGE FROM FUNCTION - name: ' + obj.name + ' value: ' + obj.value);
Ti.API.info('INFO MESSAGE FROM FUNCTION - name: ' + obj.name + ' value: ' + obj.value);
Ti.API.trace('TRACE MESSAGE FROM FUNCTION - name: ' + obj.name + ' value: ' + obj.value);
Ti.API.notice('NOTICE MESSAGE FROM FUNCTION - name: ' + obj.name + ' value: ' + obj.value);
Ti.API.critical('CRITICAL MESSAGE FROM FUNCTION - name: ' + obj.name + ' value: ' + obj.value);
Ti.API.info(1);
Ti.API.info(2);
Ti.API.info(3);
Ti.API.info(4);
Ti.API.info(5);
Ti.API.info(6);
Ti.API.info(7);
Ti.API.info(8);
Ti.API.info(9);
Ti.API.info(10);
Ti.API.info(11);
Ti.API.info(12);
Ti.API.info(13);
Ti.API.info(14);
Ti.API.info(15);


alert('ALERT LOG FROM FUNCTION - name: ' + obj.name + ' value: ' + obj.value);