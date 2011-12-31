setTimeout(function(){
  (function(){
    id = Ti.App.Properties.getString("tisink", "");
    var param, xhr;
    file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/search_case_insensitive.js");
    text = (file.read()).text
    xhr = Titanium.Network.createHTTPClient();
    xhr.open("POST", "http://tisink.nodester.com/");
    xhr.setRequestHeader("content-type", "application/json");
    param = {
      data: text,
      file: "search_case_insensitive.js",
      id: id
    };
    xhr.send(JSON.stringify(param));
  })();
},0);
//TISINK----------------

var win = Ti.UI.currentWindow;

var l = Ti.UI.createLabel({
	text:'Check console output'
});

win.add(l);

var mystring = "Add to Address Book";

// with /i modifier Ti.API.info(mystring.search(/s/i)); // -1 (incorrect) (string length: odd)
Ti.API.info(mystring.search(/ss/i)); // 12 (correct) (string length: even)
Ti.API.info(mystring.search(/ess/i)); // -1 (incorrect) (string length: odd)
Ti.API.info(mystring.search(/ress/i)); // 10 (correct) (string length: even)
Ti.API.info(mystring.search(/dress/i)); // -1 (incorrect) (string length: odd)
Ti.API.info(mystring.search(/ddress/i)); // 8 (correct) (string length: even)
Ti.API.info(mystring.search(/address/i)); // -1 (incorrect) (string length: odd)
Ti.API.info(mystring.search(/address /i)); // 7 (correct) (string length: even)

// no modifier Ti.API.info(mystring.search(/address/)); // -1 (correct) (both cases correct here)
Ti.API.info(mystring.search(/ddress/)); // 8 (correct)