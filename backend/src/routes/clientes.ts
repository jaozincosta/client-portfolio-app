import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { clienteSchema } from "../schemas/clienteSchema";

export async function clienteRoutes(app: FastifyInstance) {
  // 🔹 Listar todos os clientes
  app.get("/clientes", async () => {
    return await prisma.cliente.findMany();
  });

  // 🔹 Listar ativos de um cliente específico
  app.get("/clientes/:id/ativos", async (request, reply) => {
    const id = Number((request.params as any).id);

    if (isNaN(id)) {
      return reply.status(400).send({ error: "ID inválido" });
    }

    try {
      const cliente = await prisma.cliente.findUnique({
        where: { id },
        include: { ativos: true },
      });

      if (!cliente) {
        return reply.status(404).send({ error: "Cliente não encontrado" });
      }

      return cliente.ativos;
    } catch (err) {
      console.error(err);
      return reply
        .status(500)
        .send({ error: "Erro ao buscar ativos do cliente" });
    }
  });

  // 🔹 Criar novo cliente
  app.post("/clientes", async (request, reply) => {
    const parsed = clienteSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send(parsed.error);
    }

    try {
      const cliente = await prisma.cliente.create({
        data: parsed.data,
      });

      return reply.status(201).send(cliente);
    } catch (error) {
      console.error("Erro ao criar cliente:", error); 
      return reply.status(500).send({ error: "Erro interno ao criar cliente" });
    }
  });

  // 🔹 Atualizar cliente existente
  app.put("/clientes/:id", async (request, reply) => {
    const id = Number((request.params as any).id);

    if (isNaN(id)) {
      return reply.status(400).send({ error: "ID inválido" });
    }

    const parsed = clienteSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send(parsed.error);
    }

    try {
      const cliente = await prisma.cliente.update({
        where: { id },
        data: parsed.data,
      });

      return reply.send(cliente);
    } catch (err) {
      console.error(err);
      return reply.status(404).send({ error: "Cliente não encontrado" });
    }
  });

  // 🔹 Deletar cliente
  app.delete("/clientes/:id", async (request, reply) => {
    const id = Number((request.params as any).id);

    if (isNaN(id)) {
      return reply.status(400).send({ error: "ID inválido" });
    }

    try {
      await prisma.cliente.delete({
        where: { id },
      });

      return reply.status(204).send();
    } catch (err) {
      console.error(err);
      return reply.status(404).send({ error: "Cliente não encontrado" });
    }
  });
}
