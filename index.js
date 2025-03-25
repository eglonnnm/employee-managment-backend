const jsonServer = require("json-server");
const router = jsonServer.router("db.json");
const port = 8094;

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);
server.use(middlewares);

require("./routes/employees")(server);
require("./routes/departments")(server);

server.use("/api", router);

server.listen(port, () => {
  console.log(`JSON server is running on port ${port}`);
});
