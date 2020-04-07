const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const http = require('http');

if (cluster.isMaster) {
  console.log('This is the main process: ', process.pid);
  for (let index = 0; index < numCPUs; index++) {
    cluster.fork();
  }
  cluster.on('exit', (worker) => {
    console.log(`worker process ${process.pid} had died`);
    console.log(`only ${Object.keys(cluster.workers).length}`);
    cluster.fork();
  });
} else {
  console.log(`started a worker at ${process.pid}`);
  http
    .createServer((req, res) => {
      const message = `worker ${process.pid}...`;
      console.log(message);
      res.end(`process: ${process.pid}`);

      if (req.url === '/kill') {
        process.exit();
      } else if (req.url === '/') {
        console.log(`working on the request ${process.pid}...`);
      }
    })
    .listen(3000);
}
