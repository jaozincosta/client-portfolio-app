"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../app/lib/axios";
import { Cliente } from "../app/types/cliente";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: clientes, isLoading } = useQuery<Cliente[]>({
    queryKey: ["clientes"],
    queryFn: async () => {
      const res = await api.get("/clientes");
      return res.data;
    },
  });

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Clientes</h1>

      {isLoading ? (
        <p>Carregando clientes...</p>
      ) : (
        <ul className="space-y-4">
          {clientes?.map((cliente) => (
            <li
              key={cliente.id}
              className="border p-4 rounded-md flex flex-col gap-2"
            >
              <div>
                <p className="font-semibold text-lg">{cliente.nome}</p>
                <p className="text-sm text-gray-500">{cliente.email}</p>
                <p
                  className={`text-sm ${
                    cliente.status ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {cliente.status ? "Ativo" : "Inativo"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link href={`/clientes/${cliente.id}/ativos`}>
                  <Button variant="outline">➕ Cadastrar Ativo</Button>
                </Link>
                <Link href={`/clientes/${cliente.id}/ativos`}>
                  <Button variant="default">📄 Ver Ativos</Button>
                </Link>
                {/* <Button variant="destructive">❌ Deletar</Button> */}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
