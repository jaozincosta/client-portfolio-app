"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";

import { api } from "../lib/axios";
import { Cliente } from "../types/cliente";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const schema = z.object({
  nome: z.string().min(1, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  status: z.boolean(),
});

type ClienteFormData = z.infer<typeof schema>;

export default function ClientesPage() {
  const queryClient = useQueryClient();
  const { data: clientes, isLoading } = useQuery<Cliente[]>({
    queryKey: ["clientes"],
    queryFn: async () => {
      const res = await api.get("/clientes");
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ClienteFormData) => {
      await api.post("/clientes", data);
    },
    onSuccess: () => {
      toast.success("Cliente cadastrado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      reset();
    },
  });

  const onSubmit = (data: ClienteFormData) => {
    mutation.mutate(data);
  };

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Clientes</h1>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 border p-4 rounded-md"
      >
        <div>
          <Label htmlFor="nome">Nome</Label>
          <Input id="nome" {...register("nome")} />
          {errors.nome && <p className="text-sm text-red-500">{errors.nome.message}</p>}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" {...register("email")} />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <Label>Status</Label>
          <Select
            defaultValue="true"
            onValueChange={(val) => setValue("status", val === "true")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Ativo</SelectItem>
              <SelectItem value="false">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit">Cadastrar Cliente</Button>
      </form>

      {/* Lista de clientes */}
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
