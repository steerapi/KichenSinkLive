fs = require "fs"
process.chdir "Resources"
files = fs.readdirSync "examples"
process.chdir "examples"
files.forEach (file)->
  fileread = ""+fs.readFileSync(file)
  separator = "//TISINK----------------"
  idx = fileread.indexOf(separator)
  if idx isnt -1
    begin = idx + separator.length
    fileread = fileread.slice(begin)
  head = """
    setTimeout(function(){
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
    },0);
    //TISINK----------------\n
  """
  head += fileread
  fs.writeFileSync file, head
