"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/axios";
import { Cliente } from "../types/cliente";
import Link from "next/link";

export default function ClientesPage() {
  const { data: clientes, isLoading } = useQuery<Cliente[]>({
    queryKey: ["clientes"],
    queryFn: async () => {
      const res = await api.get("/clientes");
      return res.data;
    },
  });

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>

      {isLoading ? (
        <p>Carregando clientes...</p>
      ) : (
        <ul className="space-y-3">
          {clientes?.map((cliente) => (
            <li key={cliente.id} className="border p-4 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{cliente.nome}</p>
                  <p className="text-sm text-gray-500">{cliente.email}</p>
                  <p
                    className={`text-sm ${
                      cliente.status ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {cliente.status ? "Ativo" : "Inativo"}
                  </p>
                </div>
                <Link
                  href={`/clientes/${cliente.id}/ativos`}
                  className="text-blue-500 underline"
                >
                  Ver alocações
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
