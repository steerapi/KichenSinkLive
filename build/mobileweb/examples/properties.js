(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/properties.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "properties.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

/**
 * Result helper for checking a result against an expected value
 * @param result The result to test
 * @param expected The expected result
 * @return String Indicating Success or Failure
 */
function resultHelper(result, expected) {
			
	if (result instanceof Array) {
		var sourceResult = JSON.stringify(result);
		var expectedResult = JSON.stringify(expected);
		
		return resultHelper(sourceResult, expectedResult);
	} 
	
	if (result == expected) {
		return "Test Success ("+result+"=="+expected+")";
	} else {
		return "Test Failure: result (" + result + ") != expected (" + expected + ")";
	}
}


var l = Ti.UI.createLabel({
	text:'See Log for output',
	height:'auto',
	width:'auto'
});
win.add(l);

var array = [
	{name:'Name 1', address:'1 Main St'},
	{name:'Name 2', address:'2 Main St'},
	{name:'Name 3', address:'3 Main St'},
	{name:'Name 4', address:'4 Main St'}	
];

//
// Test Default handling
//

//Valid Defaults
Ti.API.debug('Bool: ' + resultHelper(Ti.App.Properties.getBool('whatever',true),true));
Ti.API.debug('Double: ' + resultHelper(Ti.App.Properties.getDouble('whatever',2.5),2.5));
Ti.API.debug('int: ' + resultHelper(Ti.App.Properties.getInt('whatever',1),1));
Ti.API.debug('String: ' + resultHelper(Ti.App.Properties.getString('whatever',"Fred"),"Fred"));

// First StringList Test
var defaultString = new Array("testOne","testTwo");

Ti.API.debug('StringList-1: ' + resultHelper(Ti.App.Properties.getList('whatever',defaultString),defaultString));
// Second StringList Test
defaultString = new Array();
Ti.API.debug('StringList-2: ' + resultHelper(Ti.App.Properties.getList('whatever',defaultString),defaultString));


//No Defaults
Ti.API.debug('Bool: ' + resultHelper(Ti.App.Properties.getBool('whatever'),null));
Ti.API.debug('Double: ' + resultHelper(Ti.App.Properties.getDouble('whatever'),null));
Ti.API.debug('int: ' + resultHelper(Ti.App.Properties.getInt('whatever'),null));
Ti.API.debug('String: ' + resultHelper(Ti.App.Properties.getString('whatever'),null));

Ti.API.debug('StringList: ' + resultHelper(Ti.App.Properties.getList('whatever'),null));

//
// Round-trip tests
//
//
// test setters
//
Ti.App.Properties.setString('String','I am a String Value ');
Ti.App.Properties.setInt('Int',10);
Ti.App.Properties.setBool('Bool',true);
Ti.App.Properties.setDouble('Double',10.6);
Ti.App.Properties.setList('MyList',array);

//
// test getters
//
Ti.API.info('String: '+ Ti.App.Properties.getString('String'));
Ti.API.info('Int: '+ Ti.App.Properties.getString('Int'));
Ti.API.info('Bool: '+ Ti.App.Properties.getString('Bool'));
Ti.API.info('Double: '+ Ti.App.Properties.getString('Double'));
Ti.API.info('List:');

var list = Ti.App.Properties.getList('MyList');
for (var i=0;i<list.length;i++)
{
	Ti.API.info('row['+i+'].name=' + list[i].name + ' row['+i+'].address=' + list[i].address );
}

//
//  test listProperties
//
var props = Ti.App.Properties.listProperties();
for (var i=0;i<props.length;i++)
{
	Ti.API.info('property: ' + props[i]);
}
//
// test out remove property and setting to null
//
Ti.App.Properties.setString('String',null);
Ti.App.Properties.removeProperty('Int');
Ti.API.info("String should be null - value = " + resultHelper(Ti.App.Properties.getString('String'),null));
Ti.API.info("Int should be null - value = " + resultHelper(Ti.App.Properties.getString('Int'),null));

//
// application settings testing
//
if (Ti.Platform.name != 'android')
{
	Ti.API.info("AppSetting Name = " + Ti.App.Properties.getString('name_preference'));
	Ti.API.info("AppSetting Enabled = " + Ti.App.Properties.getString('enabled_preference'));
	Ti.API.info("AppSetting Slider = " + Ti.App.Properties.getString('slider_preference'));
}
;