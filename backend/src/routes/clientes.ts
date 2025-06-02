import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { clienteSchema } from "../schemas/clienteSchema";
import { z } from "zod";

export async function clienteRoutes(app: FastifyInstance) {
  // Listar todos os clientes
  app.get("/clientes", async (_, reply) => {
    try {
      const clientes = await prisma.cliente.findMany();
      return reply.send(clientes);
    } catch (err) {
      return reply
        .status(500)
        .send({ error: "Erro ao listar clientes", detail: err });
    }
  });

  // Criar um novo cliente
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
    } catch (err) {
      return reply
        .status(500)
        .send({ error: "Erro ao criar cliente", detail: err });
    }
  });

  // Atualizar um cliente
  app.put("/clientes/:id", async (request, reply) => {
    const id = Number((request.params as { id: string }).id);
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
    } catch {
      return reply.status(404).send({ error: "Cliente não encontrado" });
    }
  });

  // Deletar cliente
  app.delete("/clientes/:id", async (request, reply) => {
    const id = Number((request.params as { id: string }).id);

    try {
      await prisma.cliente.delete({
        where: { id },
      });

      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ error: "Cliente não encontrado" });
    }
  });

  // Listar ativos vinculados a um cliente
  app.get("/clientes/:id/ativos", async (request, reply) => {
    const id = Number((request.params as { id: string }).id);

    try {
      const cliente = await prisma.cliente.findUnique({
        where: { id },
        include: { ativos: true },
      });

      if (!cliente) {
        return reply.status(404).send({ error: "Cliente não encontrado" });
      }

      return reply.send(cliente.ativos);
    } catch (err) {
      return reply
        .status(500)
        .send({ error: "Erro ao buscar ativos do cliente", detail: err });
    }
  });
}
