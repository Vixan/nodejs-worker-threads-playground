const { createGzip, gzipSync } = require("zlib");
const { pipeline } = require("stream");
const { promisify } = require("util");
const { createReadStream, createWriteStream, readFileSync } = require("fs");

const pipePromise = promisify(pipeline);

const gzipFile = async (inputPath, outputPath) => {
  const gzip = createGzip();
  const source = createReadStream(inputPath);
  const destination = createWriteStream(outputPath);

  await pipePromise(source, gzip, destination);
};

const gzipFilesSync = files =>
  files.map(file => ({
    ...file,
    data: gzipSync(readFileSync(file.inputPath)),
  }));

module.exports = {
  gzipFile,
  gzipFilesSync,
};
