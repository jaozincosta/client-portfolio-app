"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { Ativo } from "../types/ativo";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ativoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  valor: z.number().min(0.01, "Valor deve ser maior que zero"),
});

type AtivoFormData = z.infer<typeof ativoSchema>;

export default function AtivosPage() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AtivoFormData>({
    resolver: zodResolver(ativoSchema),
  });

  const {
    data: ativos,
    isLoading,
    error,
  } = useQuery<Ativo[]>({
    queryKey: ["ativos"],
    queryFn: async () => {
      const response = await api.get("/ativos");
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: AtivoFormData) => {
      if (editandoId) {
        await api.put(`/ativos/${editandoId}`, data);
      } else {
        await api.post("/ativos", data);
      }
    },
    onSuccess: () => {
      toast.success(editandoId ? "Ativo atualizado!" : "Ativo cadastrado!");
      queryClient.invalidateQueries({ queryKey: ["ativos"] });
      reset();
      setFormOpen(false);
      setEditandoId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/ativos/${id}`);
    },
    onSuccess: () => {
      toast.success("Ativo removido!");
      queryClient.invalidateQueries({ queryKey: ["ativos"] });
    },
  });

  const onSubmit = (data: AtivoFormData) => {
    mutation.mutate({
      nome: data.nome,
      valor: Number(data.valor),
    });
  };

  const handleEditar = (ativo: Ativo) => {
    setEditandoId(ativo.id);
    setValue("nome", ativo.nome);
    setValue("valor", ativo.valor);
    setFormOpen(true);
  };

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Ativos Financeiros</h1>
        <Button
          onClick={() => {
            if (formOpen && editandoId) {
              reset();
              setEditandoId(null);
            }
            setFormOpen(!formOpen);
          }}
        >
          {formOpen ? "Cancelar" : "Adicionar Ativo"}
        </Button>
      </div>

      {formOpen && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 mb-8 border p-4 rounded"
        >
          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" {...register("nome")} />
            {errors.nome && (
              <p className="text-red-500 text-sm">{errors.nome.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="valor">Valor (R$)</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              {...register("valor", { valueAsNumber: true })}
            />
            {errors.valor && (
              <p className="text-red-500 text-sm">{errors.valor.message}</p>
            )}
          </div>

          <Button type="submit">
            {editandoId ? "Atualizar" : "Cadastrar"}
          </Button>
        </form>
      )}

      {isLoading ? (
        <p>Carregando ativos...</p>
      ) : error ? (
        <p className="text-red-500">Erro ao carregar ativos.</p>
      ) : (
        <ul className="space-y-2 mt-4">
          {ativos?.map((ativo) => (
            <li
              key={ativo.id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <strong>{ativo.nome}</strong> — R$ {ativo.valor.toFixed(2)}
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => handleEditar(ativo)}>
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteMutation.mutate(ativo.id)}
                >
                  Deletar
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
