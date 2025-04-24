import ProductManagement from "@/components/product-management"

export default function Home() {
  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Sistema de Gerenciamento de Produtos</h1>
      <ProductManagement />
    </main>
  )
}
