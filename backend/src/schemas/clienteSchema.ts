import { z } from "zod";

export const clienteSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  status: z.boolean(),
});

export type ClienteInput = z.infer<typeof clienteSchema>;
