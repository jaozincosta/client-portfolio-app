import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { clienteSchema } from "../schemas/clienteSchema";

export async function clienteRoutes(app: FastifyInstance) {
  app.get("/clientes", async () => {
    return await prisma.cliente.findMany();
  });

  app.get("/clientes/:id/ativos", async (request) => {
    const id = Number((request.params as any).id);
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: { ativos: true },
    });

    return cliente?.ativos ?? [];
  });

  app.post("/clientes", async (request, reply) => {
    const parsed = clienteSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send(parsed.error);
    }

    const cliente = await prisma.cliente.create({ data: parsed.data });
    reply.status(201).send(cliente);
  });

  // ...put e delete como já tem
}
