var fs =require("fs");
var JSZip = require("jszip");

const addFilesFromDirectoryToZip = (directoryPath = "", zip) => {
  const directoryContents = fs.readdirSync(directoryPath, {
    withFileTypes: true,
  });
 
  directoryContents.forEach(({ name }) => {
    const path = `${directoryPath}/${name}`;

    if (fs.statSync(path).isFile()) {
      zip.file(path, fs.readFileSync(path, "utf-8"));
    }

    if (fs.statSync(path).isDirectory()) {
      addFilesFromDirectoryToZip(path, zip);
    }
  });
};

module.exports= (directoryPath = "") => {
  return new Promise((ok,ko)=>{
    const zip = new JSZip();
    addFilesFromDirectoryToZip(directoryPath, zip);

    // We'll finalize our zip archive here...
    var zipFile=`${__dirname}/mp3.zip`;
    
    zip.generateNodeStream({streamFiles:true})
      .pipe(fs.createWriteStream(zipFile))
      .on('finish', function () {          
          ok(zipFile)
      });
    return zipFile;
  })
};