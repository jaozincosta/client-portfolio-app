import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function ativoRoutes(app: FastifyInstance) {
  const schema = z.object({
    nome: z.string(),
    valor: z.number(),
    clienteId: z.number(),
  });

  app.post("/ativos", async (request, reply) => {
    const result = schema.safeParse(request.body);
    if (!result.success) {
      return reply.status(400).send(result.error);
    }

    const ativo = await prisma.ativo.create({
      data: result.data,
    });

    reply.status(201).send(ativo);
  });
}
