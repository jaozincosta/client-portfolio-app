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

    const { clienteId, nome, valor } = parsed.data;

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
      return reply
        .status(500)
        .send({ error: "Erro ao cadastrar ativo", detail: error });
    }
  });
}
