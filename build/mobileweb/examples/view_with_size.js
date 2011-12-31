(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Ti.Filesystem.getFile("examples/view_with_size.js");
  xhr = Ti.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "view_with_size.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;

// this test should test that we have a red 100x100 view in the 
// center of the screen by using the size property to set it

var view = Ti.UI.createView({
	size:{
		width:100,
		height:100
	},
	backgroundColor:"red"
});


win.add(view);

var label = Ti.UI.createLabel({
	text:"Should be 100x100 red square in center",
	textAlign:"center",
	width:"auto",
	height:"auto",
	top:20
});

win.add(label);


var button = Ti.UI.createButton({
    title:"Change Size",
    width:120,
    height:40,
    bottom:20
});
win.add(button);

button.addEventListener('click',function() {
    view.size = {width:150,height:150};
    label.text = "Box should now be 150x150";
});