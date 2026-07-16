import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  name: string
  price: number
  size: string
  quantity: number
  image_url?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string, size: string) => void
  updateQty: (productId: string, size: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      total: 0,
      itemCount: 0,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.size === item.size,
          )
          let newItems: CartItem[]
          if (existing) {
            newItems = state.items.map((i) =>
              i.productId === item.productId && i.size === item.size
                ? { ...i, quantity: i.quantity + 1 }
                : i,
            )
          } else {
            newItems = [...state.items, { ...item, quantity: 1 }]
          }
          const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
          const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0)
          return { items: newItems, total, itemCount }
        }),

      removeItem: (productId, size) =>
        set((state) => {
          const newItems = state.items.filter(
            (i) => !(i.productId === productId && i.size === size),
          )
          const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
          const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0)
          return { items: newItems, total, itemCount }
        }),

      updateQty: (productId, size, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            const newItems = state.items.filter(
              (i) => !(i.productId === productId && i.size === size),
            )
            const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
            const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0)
            return { items: newItems, total, itemCount }
          }
          const newItems = state.items.map((i) =>
            i.productId === productId && i.size === size ? { ...i, quantity } : i,
          )
          const total = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
          const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0)
          return { items: newItems, total, itemCount }
        }),

      clearCart: () => set({ items: [], total: 0, itemCount: 0 }),
    }),
    { name: 'the-hype-cart' },
  ),
)
