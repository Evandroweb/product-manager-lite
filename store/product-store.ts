import { create } from "zustand"
import type { Product } from "@/types/product"
import { mockProducts } from "@/lib/mock-data"

interface ProductState {
  products: Product[]
  editingProduct: Product | null
  addProduct: (product: Product) => void
  updateProduct: (product: Product) => void
  removeProduct: (id: string) => void
  setEditingProduct: (product: Product | null) => void
}

export const useProductStore = create<ProductState>((set) => ({
  products: mockProducts,
  editingProduct: null,
  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
    })),
  updateProduct: (product) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === product.id ? product : p)),
    })),
  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
  setEditingProduct: (product) => set({ editingProduct: product }),
}))
