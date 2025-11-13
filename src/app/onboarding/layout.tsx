export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Removido verificação server-side que causava loop infinito
  // A página de onboarding já faz verificação client-side e redireciona se necessário
  return <>{children}</>;
}
