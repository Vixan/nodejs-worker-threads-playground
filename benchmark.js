export const timerify = async (task) => {
  performance.measure("start");
  await task();
  performance.measure("end");

  const { duration } = performance.getEntriesByType("measure")[1];

  performance.clearMarks();
  performance.clearMeasures();

  return { duration: duration };
};
