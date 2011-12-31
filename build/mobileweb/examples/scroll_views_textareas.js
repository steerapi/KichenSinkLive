(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/scroll_views_textareas.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "scroll_views_textareas.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

var scrollView = Ti.UI.createScrollView({
	contentHeight:'auto',
	contentWidth:'auto'
});

win.add(scrollView);

var ta1 = Ti.UI.createTextArea({
	value:'I am a textarea',
	height:100,
	width:300,
	top:10,
	font:{fontSize:20,fontFamily:'Marker Felt', fontWeight:'bold'},
	color:'#888',
	textAlign:'left',
	borderWidth:2,
	borderColor:'#bbb',
	borderRadius:5
});
scrollView.add(ta1);

var ta2 = Ti.UI.createTextArea({
	value:'I am a textarea',
	height:100,
	width:300,
	top:120,
	font:{fontSize:20,fontFamily:'Marker Felt', fontWeight:'bold'},
	color:'#888',
	textAlign:'left',
	borderWidth:2,
	borderColor:'#555',
	borderRadius:5
});
scrollView.add(ta2);

var ta2 = Ti.UI.createTextArea({
	value:'I am a textarea',
	height:100,
	width:300,
	top:230,
	font:{fontSize:20,fontFamily:'Marker Felt', fontWeight:'bold'},
	color:'#888',
	textAlign:'left',
	borderWidth:2,
	borderColor:'#555',
	borderRadius:5
});
scrollView.add(ta2);