import "./globals.css";
import { ReactQueryProvider } from "@/lib/react-query";

export const metadata = {
  title: "Client Portfolio App",
  description: "Gerenciador de Clientes e Ativos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
