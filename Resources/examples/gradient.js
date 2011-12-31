(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile("examples/gradient.js");
  xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "gradient.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Ti.UI.currentWindow;
var view1 = Ti.UI.createView({
	height:50,
	width:300,
	top:10,
	borderRadius:5,
	backgroundGradient:{
		type:'linear',
		colors:[{color:'#d4d4d4',position:0.0},{color:'#c4c4c4',position:0.50},{color:'#b4b4b4',position:1.0}]
	}
});
win.add(view1);

var view2 = Ti.UI.createView({
height:50,
width:300,
top:70,
backgroundGradient:{
	type:'linear',
	colors:['#111','#444'],
	startPoint:{x:0,y:25},
	endPoint:{x:0,y:50},
	backFillStart:true
}
});
win.add(view2);
// var label1 = Titanium.UI.createLabel({
	// color:'#999',
	// text:'I am Window 2',
	// font:{fontSize:20,fontFamily:'Helvetica Neue'},
	// textAlign:'center',
	// width:'auto',
	// backgroundGradient:{
		// type:'linear',
		// startPoint:{x:40,y:40},
		// endPoint:{x:80,y:200},
		// backfillStart:true,
		// backfillEnd:true,
		// colors:['red','green']
	// }
// });
// 
// var label2 = Titanium.UI.createLabel({
	// color:'#999',
	// text:'I am Window 2',
	// font:{fontSize:20,fontFamily:'Helvetica Neue'},
	// textAlign:'center',
	// width:'auto',
	// backgroundGradient:{
		// type:'radial',
		// startRadius:'20%',
		// endRadius:0,
		// colors:[{color:'red',position:0.0},{color:'purple',position:0.25},{color:'green',position:1.0}]
	// }
// });
// win.add(label1);
// win.add(label2);
