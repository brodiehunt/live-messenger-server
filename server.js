const http = require('http');
const socketService = require('./services/socketServices.js');
const app = require('./app.js');
require('./config/database.js');
const port = process.env.PORT || 3000;

const server = http.createServer(app);

socketService.init(server);

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
})