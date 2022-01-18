const workerpool = require("workerpool");
const Path = require("path");

let poolProxy = null;

const initializeWorkerPool = async options => {
  const pool = workerpool.pool(
    Path.join(__dirname, "/workers/file-compression-worker.js"),
    options
  );
  poolProxy = await pool.proxy();
  console.log(
    `Worker Threads - Min Workers: ${pool.minWorkers} - Max Workers: ${pool.maxWorkers} - Worker Type: ${pool.workerType}`
  );
};

const getWorkerPoolProxy = () => {
  return poolProxy;
};

module.exports = {
  initializeWorkerPool,
  getWorkerPoolProxy,
};
