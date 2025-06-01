import Fastify from "fastify";
import { clienteRoutes } from "./routes/clientes";

const app = Fastify();

app.register(clienteRoutes);

app.listen({ port: 3333, host: "0.0.0.0" }, () => {
  console.log("Backend rodando em http://localhost:3333");
});
