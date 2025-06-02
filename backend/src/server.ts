// src/server.ts
import Fastify from "fastify";
import cors from "@fastify/cors";
import { clienteRoutes } from "./routes/clientes";
import { ativoRoutes } from "./routes/ativos";

async function main() {
  const app = Fastify();

  await app.register(cors, {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  });

  // Registra rotas
  await app.register(clienteRoutes, { prefix: "/clientes" });
  await app.register(ativoRoutes, { prefix: "/ativos" });

  try {
    await app.listen({ port: 3333 });
    console.log("🚀 Backend rodando em http://localhost:3333");
  } catch (err) {
    console.error("Erro ao iniciar o servidor:", err);
    process.exit(1);
  }
}

main();
