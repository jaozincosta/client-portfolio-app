"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-6 p-4">
      <h1 className="text-3xl font-bold">
        Bem-vindo ao sistema de investimentos
      </h1>

      <div className="flex flex-col gap-4">
        <Link href="/clientes">
          <Button className="w-60">Gerenciar Clientes</Button>
        </Link>

        <Link href="/clientes/1/ativos">
          <Button variant="secondary" className="w-60">
            Cadastrar Ativos (Cliente 1)
          </Button>
        </Link>
      </div>
    </main>
  );
}
