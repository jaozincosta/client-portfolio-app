import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

const ativoSchema = z.object({
  nome: z.string().min(1, "Nome do ativo é obrigatório"),
  valor: z.number().positive("Valor deve ser positivo"),
  clienteId: z.number().int().positive("Cliente ID deve ser positivo"),
});

export async function ativoRoutes(app: FastifyInstance) {
  // GET: Listar todos os ativos
  app.get("/", async (_, reply) => {
    try {
      const ativos = await prisma.ativo.findMany({
        include: { cliente: true },
      });
      return reply.send(ativos);
    } catch (error) {
      return reply
        .status(500)
        .send({ error: "Erro ao buscar ativos", detail: error });
    }
  });

  // POST: Criar novo ativo
  app.post("/", async (request, reply) => {
    const parsed = ativoSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send(parsed.error);
    }

    try {
      const ativo = await prisma.ativo.create({
        data: parsed.data,
      });

      return reply.code(201).send(ativo);
    } catch (error) {
      return reply
        .status(500)
        .send({ error: "Erro ao criar ativo", detail: error });
    }
  });

  // PUT: Atualizar ativo
  app.put("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const parsed = ativoSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send(parsed.error);
    }

    try {
      const ativo = await prisma.ativo.update({
        where: { id: Number(id) },
        data: parsed.data,
      });

      return reply.send(ativo);
    } catch (error) {
      return reply
        .status(500)
        .send({ error: "Erro ao atualizar ativo", detail: error });
    }
  });

  // DELETE: Remover ativo
  app.delete("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      await prisma.ativo.delete({
        where: { id: Number(id) },
      });

      return reply.status(204).send();
    } catch (error) {
      return reply
        .status(500)
        .send({ error: "Erro ao remover ativo", detail: error });
    }
  });
}
