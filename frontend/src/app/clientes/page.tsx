"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { Cliente } from "../types/cliente";
import { Ativo } from "../types/ativo";
import { useState } from "react";

export default function ClientesPage() {
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(
    null
  );
  const [ativosCliente, setAtivosCliente] = useState<Ativo[]>([]);
  const [loadingAtivos, setLoadingAtivos] = useState(false);

  const {
    data: clientes,
    isLoading,
    error,
  } = useQuery<Cliente[]>({
    queryKey: ["clientes"],
    queryFn: async () => {
      const response = await api.get("/clientes");
      return response.data;
    },
  });

  async function fetchAtivos(clienteId: number) {
    setLoadingAtivos(true);
    setSelectedClienteId(clienteId);

    try {
      const response = await api.get(`/clientes/${clienteId}/ativos`);
      setAtivosCliente(response.data);
    } catch (err) {
      console.error("Erro ao buscar ativos do cliente", err);
    } finally {
      setLoadingAtivos(false);
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>

      {isLoading && <p>Carregando clientes...</p>}
      {error && <p className="text-red-500">Erro ao carregar clientes.</p>}

      <ul className="space-y-4">
        {clientes?.map((cliente) => (
          <li key={cliente.id} className="border p-4 rounded">
            <div className="flex justify-between items-center">
              <div>
                <strong>{cliente.nome}</strong> <br />
                {cliente.email} <br />
                Status: {cliente.status ? "Ativo" : "Inativo"}
              </div>
              <button
                onClick={() => fetchAtivos(cliente.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Ver Ativos
              </button>
            </div>
            {selectedClienteId === cliente.id && (
              <div className="mt-4">
                <h2 className="font-semibold">Ativos:</h2>
                {loadingAtivos ? (
                  <p>Carregando ativos...</p>
                ) : ativosCliente.length === 0 ? (
                  <p>Este cliente não possui ativos.</p>
                ) : (
                  <ul className="list-disc ml-5 mt-2">
                    {ativosCliente.map((ativo, i) => (
                      <li key={i}>
                        {ativo.nome} — R$ {ativo.valor.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
