const fastify = require("fastify");
const fileUpload = require("fastify-file-upload");
const { gzipFilesSync } = require("./file-compression.js");
const {
  getWorkerPoolProxy,
  initializeWorkerPool,
} = require("./worker-pool-proxy.js");
const { statSync } = require("fs");

const app = fastify();

const fromRawFiles = files =>
  Object.values(files).map(value => ({
    inputPath: value.tempFilePath,
    outputPath: `./files/upload/${value.name}.gzip`,
    data: value.data,
    name: value.name,
    mimetype: value.mimetype,
  }));

app.register(fileUpload, {
  limits: { fileSize: 100 * 1024 * 1024 },
  useTempFiles: true,
  tempFileDir: "./files/temp/",
  preserveExtension: true,
});

app.post("/compress", async (req, reply) => {
  const files = fromRawFiles(req.raw.files);

  try {
    const gzippedFiles = gzipFilesSync(files);

    const sizedGzippedFiles = gzippedFiles.map(file => ({
      name: file.name,
      originalSizeInMb: (statSync(file.inputPath)?.size ?? 0) / (1024 * 1024),
      compressedSizeInMb: file.data.length / (1024 * 1024),
    }));
    reply.code(200).send(sizedGzippedFiles);
  } catch (error) {
    reply.code(500).send(error);
  }
});

app.post("/compress-workers", async (req, reply) => {
  const files = fromRawFiles(req.raw.files);

  try {
    const workerPoolProxy = getWorkerPoolProxy();
    const gzippedFiles = await workerPoolProxy.gzipFilesSyncParallel(files);

    const sizedGzippedFiles = gzippedFiles.map(file => ({
      name: file.name,
      originalSizeInMb: (statSync(file.inputPath)?.size ?? 0) / (1024 * 1024),
      compressedSizeInMb: file.data.length / (1024 * 1024),
    }));
    reply.code(200).send(sizedGzippedFiles);
  } catch (error) {
    reply.code(500).send(error);
  }
});

app.listen(3000, async (err, address) => {
  await initializeWorkerPool({
    minWorkers: 1,
  });

  if (err) {
    throw err;
  }

  console.log(`Server listening on ${address}`);
});
