import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AdminProduct {
  id: string
  name: string
  price: number
  sizes: string[]
  description: string
  image_url: string
  available: boolean
  delivery: boolean
}

interface ProductStore {
  products: AdminProduct[]
  addProduct: (product: AdminProduct) => void
  updateProduct: (id: string, data: Partial<AdminProduct>) => void
  deleteProduct: (id: string) => void
  toggleAvailability: (id: string) => void
  toggleDelivery: (id: string) => void
}

const DEFAULT_PRODUCTS: AdminProduct[] = [
  {
    id: 'prod-1',
    name: 'Playera Oficial HYBRID EVENT',
    price: 500,
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Camiseta técnica de alto rendimiento. Tela transpirable con diseño brutalista. Color Negro con detalles en #E6F2B1.',
    image_url: 'https://images.unsplash.com/photo-1581515302716-69279fa6fdc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    available: true,
    delivery: true,
  },
  {
    id: 'prod-2',
    name: 'Gorra Técnica HYBRID',
    price: 350,
    sizes: ['UNITALLA'],
    description: 'Gorra ultraligera para entrenar o competir. Ajuste perfecto y banda de sudor interna.',
    image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    available: true,
    delivery: true,
  },
  {
    id: 'prod-3',
    name: 'Termo Táctico HYBRID 1L',
    price: 450,
    sizes: ['1 LITRO'],
    description: 'Termo de acero inoxidable con recubrimiento mate. Mantiene el agua helada durante todo el circuito.',
    image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    available: true,
    delivery: true,
  },
  {
    id: 'prod-4',
    name: 'Coco Edición Especial ENFORMA',
    price: 80,
    sizes: ['ÚNICO'],
    description: 'Hidratación natural en su estado más puro. Coco frío, perforado al momento. El mejor recovery para combatir el clima de Yucatán tras cruzar la meta.',
    image_url: 'https://images.unsplash.com/photo-1526567228809-58b105d1c311?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    available: true,
    delivery: false,
  },
]

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: DEFAULT_PRODUCTS,

      addProduct: (product) =>
        set((state) => ({ products: [...state.products, product] })),

      updateProduct: (id, data) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...data } : p,
          ),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      toggleAvailability: (id) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, available: !p.available } : p,
          ),
        })),

      toggleDelivery: (id) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, delivery: !p.delivery } : p,
          ),
        })),
    }),
    { name: 'the-hype-products' },
  ),
)