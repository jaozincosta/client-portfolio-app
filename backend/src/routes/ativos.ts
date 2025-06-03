import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function ativoRoutes(app: FastifyInstance) {
  const schema = z.object({
    nome: z.string().min(1),
    valor: z.number().positive(),
    clienteId: z.number().int(),
  });

  app.post("/ativos", async (request, reply) => {
    const parsed = schema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send(parsed.error);
    }

    const { nome, valor, clienteId } = parsed.data;

    try {
      const cliente = await prisma.cliente.findUnique({
        where: { id: clienteId },
      });
      if (!cliente) {
        return reply.status(404).send({ error: "Cliente não encontrado" });
      }

      const ativo = await prisma.ativo.create({
        data: { nome, valor, clienteId },
      });

      return reply.status(201).send(ativo);
    } catch (error) {
      console.error("Erro ao criar ativo:", error);
      return reply
        .status(500)
        .send({ error: "Erro ao criar ativo", detail: error });
    }
  });
}
