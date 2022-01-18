const workerpool = require("workerpool");
const { gzipFilesSync } = require("../file-compression");

const gzipFilesSyncParallel = files => gzipFilesSync(files);

workerpool.worker({
  gzipFilesSyncParallel,
});
