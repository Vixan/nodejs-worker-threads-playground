const autocannon = require("autocannon");

const stressTestFileUpload = async () => {
  const autocannonCompression = await autocannon(
    {
      url: "http://127.0.0.1:3000/compress",
      connections: 5,
      pipelining: 1,
      timeout: 1000000,
      amount: 5,
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "*/*",
      },
      form: {
        "image 1": { type: "file", path: "./files/raw-image.NEF" },
        "image 2": { type: "file", path: "./files/raw-image.NEF" },
        "image 3": { type: "file", path: "./files/raw-image.NEF" },
      },
      title: "Load test file compression",
    },
    console.log
  );

  process.once("SIGINT", () => {
    autocannonCompression.stop();
  });

  autocannon.track(autocannonCompression, {
    renderResultsTable: true,
    renderLatencyTable: false,
  });
};

stressTestFileUpload();
