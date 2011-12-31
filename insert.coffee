fs = require "fs"
process.chdir "Resources"
files = fs.readdirSync "examples"
process.chdir "examples"
files.forEach (file)->
  content = """
    (function(){
      id = Ti.App.Properties.getString("tisink", "");
      var param, xhr;
      file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory,"examples/#{file}");
      text = (file.read()).text
      xhr = Titanium.Network.createHTTPClient();
      xhr.open("POST", "http://tisink.nodester.com/");
      xhr.setRequestHeader("content-type", "application/json");
      param = {
        data: text,
        file: "#{file}",
        id: id
      };
      xhr.send(JSON.stringify(param));
    })();
    //TISINK----------------\n
  """
  content += fs.readFileSync file
  fs.writeFileSync file, content
