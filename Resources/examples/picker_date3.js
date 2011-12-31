(function(){
  id = Ti.App.Properties.getString("tisink", "");
  var param, xhr;
  file = Titanium.Filesystem.getFile("examples/picker_date3.js");
  xhr = Titanium.Network.createHTTPClient();
  xhr.open("POST", "http://tisink.nodester.com/");
  xhr.setRequestHeader("content-type", "application/json");
  param = {
    data: "" + file.read(),
    file: "picker_date3.js",
    id: id
  };
  xhr.send(JSON.stringify(param));
})();
//TISINK----------------
var win = Titanium.UI.currentWindow;
win.backgroundColor = 'black';

var minDate = new Date();
minDate.setFullYear(2009);
minDate.setMonth(0);
minDate.setDate(1);

var maxDate = new Date();
maxDate.setFullYear(2009);
maxDate.setMonth(11);
maxDate.setDate(31);

var value = new Date();
value.setFullYear(2009);
value.setMonth(0);
value.setDate(1);

var picker = Ti.UI.createPicker({
	type:Ti.UI.PICKER_TYPE_DATE_AND_TIME,
	minDate:minDate,
	maxDate:maxDate,
	value:value
});

// turn on the selection indicator (off by default)
picker.selectionIndicator = true;

win.add(picker);

var label = Ti.UI.createLabel({
	text:'Choose a date/time',
	top:6,
	width:'auto',
	height:'auto',
	textAlign:'center',
	color:'white'
});
win.add(label);

picker.addEventListener('change',function(e)
{
	label.text = e.value.toLocaleString();
});
