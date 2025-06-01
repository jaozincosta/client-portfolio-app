"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Ativo } from "@/types/ativo";

export default function AtivosPage() {
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

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ativos Financeiros</h1>

      {isLoading && <p>Carregando ativos...</p>}
      {error && <p className="text-red-500">Erro ao carregar ativos.</p>}

      <ul className="space-y-2 mt-4">
        {ativos?.map((ativo, index) => (
          <li key={index} className="border p-4 rounded">
            <strong>{ativo.nome}</strong> — R$ {ativo.valor.toFixed(2)}
          </li>
        ))}
      </ul>
    </main>
  );
}
