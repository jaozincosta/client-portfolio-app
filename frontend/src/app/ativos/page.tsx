// app/clientes/[id]/ativos/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { useState } from "react";

interface Ativo {
  id: number;
  nome: string;
  valor: number;
}

export default function ClienteAtivosPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState<number>(0);

  const { data: ativos, isLoading } = useQuery<Ativo[]>({
    queryKey: ["ativos", id],
    queryFn: async () => {
      const response = await api.get(`/clientes/${id}/ativos`);
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      await api.post("/ativos", {
        nome,
        valor,
        clienteId: Number(id),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ativos", id] });
      setNome("");
      setValor(0);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Ativos do Cliente {id}</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Nome do Ativo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(Number(e.target.value))}
          className="border p-2 w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Cadastrar Ativo
        </button>
      </form>

      {isLoading ? (
        <p>Carregando ativos...</p>
      ) : (
        <ul className="space-y-2">
          {ativos?.map((ativo) => (
            <li key={ativo.id} className="border p-4 rounded">
              <strong>{ativo.nome}</strong> — R$ {ativo.valor.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
