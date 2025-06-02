import Fastify from "fastify";
import cors from "@fastify/cors";
import { clienteRoutes } from "../../backend/src/routes/clientes";
import { ativoRoutes } from "./routes/ativos";

async function main() {
  const app = Fastify();

  await app.register(cors, {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  });

  await app.register(clienteRoutes);
  await app.register(ativoRoutes);

  await app.listen({ port: 3333 });
  console.log("🚀 Servidor rodando em http://localhost:3333");
}

main();
