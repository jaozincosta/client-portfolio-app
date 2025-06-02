"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "../../../lib/axios";
import { Ativo } from "../../../types/ativo";

const ativoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  valor: z.coerce.number().positive("Valor deve ser positivo"),
});

type AtivoFormData = z.infer<typeof ativoSchema>;

export default function AtivosDoClientePage() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AtivoFormData>({
    resolver: zodResolver(ativoSchema),
  });

  const { data: ativos, isLoading } = useQuery<Ativo[]>({
    queryKey: ["ativos", id],
    queryFn: async () => {
      const res = await api.get(`/clientes/${id}/ativos`);
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: AtivoFormData) => {
      await api.post("/ativos", { ...data, clienteId: Number(id) });
    },
    onSuccess: () => {
      toast.success("Ativo cadastrado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["ativos", id] });
      reset();
    },
  });

  const onSubmit = (data: AtivoFormData) => {
    mutation.mutate(data);
  };

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Ativos do Cliente {id}</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 border p-4 rounded-md"
      >
        <div>
          <Label>Nome</Label>
          <Input {...register("nome")} />
          {errors.nome && (
            <p className="text-red-500 text-sm">{errors.nome.message}</p>
          )}
        </div>

        <div>
          <Label>Valor (R$)</Label>
          <Input type="number" step="0.01" {...register("valor")} />
          {errors.valor && (
            <p className="text-red-500 text-sm">{errors.valor.message}</p>
          )}
        </div>

        <Button type="submit">Cadastrar Ativo</Button>
      </form>

      {isLoading ? (
        <p>Carregando ativos...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ativos?.map((ativo) => (
              <TableRow key={ativo.id}>
                <TableCell>{ativo.nome}</TableCell>
                <TableCell>R$ {ativo.valor.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </main>
  );
}
