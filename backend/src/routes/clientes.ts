import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { clienteSchema } from "../schemas/clienteSchema";

export async function clienteRoutes(app: FastifyInstance) {
  app.get("/clientes", async () => {
    return await prisma.cliente.findMany();
  });

  app.post("/clientes", async (request, reply) => {
    const parsed = clienteSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send(parsed.error);
    }

    const cliente = await prisma.cliente.create({
      data: parsed.data,
    });

    reply.code(201).send(cliente);
  });

  app.put("/clientes/:id", async (request, reply) => {
    const id = Number(request.params["id"]);

    const parsed = clienteSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send(parsed.error);
    }

    const cliente = await prisma.cliente.update({
      where: { id },
      data: parsed.data,
    });

    reply.send(cliente);
  });

  app.get("/ativos", async () => {
    return [
      { nome: "Ação XYZ", valor: 120.5 },
      { nome: "Fundo ABC", valor: 85.9 },
      { nome: "ETF DEF", valor: 102.3 },
    ];
  });
}
