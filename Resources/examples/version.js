(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile("examples/version.js");
  xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "version.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
//
// returns true if iphone/ipad and version is 3.2+
//
function isIPhone3_2_Plus()
{
	// add iphone specific tests
	if (Titanium.Platform.name == 'iPhone OS')
	{
		var version = Titanium.Platform.version.split(".");
		var major = parseInt(version[0],10);
		var minor = parseInt(version[1],10);
		
		// can only test this support on a 3.2+ device
		if (major > 3 || (major == 3 && minor > 1))
		{
			return true;
		}
	}
	return false;
}

function isiOS4Plus()
{
	// add iphone specific tests
	if (Titanium.Platform.name == 'iPhone OS')
	{
		var version = Titanium.Platform.version.split(".");
		var major = parseInt(version[0],10);
		
		// can only test this support on a 3.2+ device
		if (major >= 4)
		{
			return true;
		}
	}
	return false;
}
