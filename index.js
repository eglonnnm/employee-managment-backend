const jsonServer = require("json-server");
const port = 8094;

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);
server.use(middlewares);

const departmentsRoutes = require("./routes/departments");

departmentsRoutes(server);

server.listen(port, () => {
  console.log(`JSON server is running on port ${port}`);
});
