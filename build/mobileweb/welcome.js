// use a closure to (a) test it and (b) not expose this into global scope
(function()
{
	tabGroup.addEventListener("open", function(e) {
		// window container
		var welcomeWindow = Ti.UI.createWindow({
			height:80,
			width:200,
			touchEnabled:false
		});

		// black view
		var indView = Ti.UI.createView({
			height:80,
			width:200,
			backgroundColor:'#000',
			borderRadius:10,
			opacity:0.8,
			touchEnabled:false
		});
		welcomeWindow.add(indView);

		// message
		var message = Ti.UI.createLabel({
			text:'Appcelerator Titanium '+Ti.version,
			color:'#fff',
			textAlign:'center',
			font:{fontSize:18,fontWeight:'bold'},
			height:'auto',
			width:'auto'
		});
		welcomeWindow.add(message);
		welcomeWindow.open();

		var animationProperties = {delay: 1500, duration: 1000, opacity: 0.1};
		if (Ti.Platform.osname == "iPhone OS") {
			animationProperties.transform =
				Ti.UI.create2DMatrix().translate(-200,200).scale(0);
		}
		welcomeWindow.animate(animationProperties, function()
		{
			welcomeWindow.close();
		});
	});
})();

;