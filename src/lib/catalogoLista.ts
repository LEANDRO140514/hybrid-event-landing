import type { Producto } from '../data/catalogo'

export type CatalogoExperience = 'compite' | 'half_hybrid' | 'asiste'

export interface CatalogoFila {
  producto: Producto
  /** Same value as the id of the product's card, so the row can link straight to it. */
  anchorId: string
}

export interface CatalogoGrupo {
  key: CatalogoExperience
  titulo: string
  /** Value reported to analytics when a row of this block is tapped. */
  experience: CatalogoExperience
  filas: CatalogoFila[]
}

/** id of the product card in the page; also the hash used by deep links such as /#cat-IND-H. */
export function anchorIdForProducto(code: string): string {
  return `cat-${code}`
}

// Individual first, then doubles, then relay. Array.prototype.sort is stable,
// so products of the same kind keep their order from the catalog.
const TIPO_RANK: Record<string, number> = {
  Individual: 0,
  '½ Hybrid Individual': 0,
  Dobles: 1,
  '½ Hybrid Dobles': 1,
  Relay: 2,
}

function ordenar(productos: Producto[]): Producto[] {
  return [...productos].sort((a, b) => (TIPO_RANK[a.tipo] ?? 3) - (TIPO_RANK[b.tipo] ?? 3))
}

function grupo(key: CatalogoExperience, titulo: string, productos: Producto[]): CatalogoGrupo {
  return {
    key,
    titulo,
    experience: key,
    filas: ordenar(productos).map((producto) => ({ producto, anchorId: anchorIdForProducto(producto.code) })),
  }
}

/**
 * The lists come from the same arrays the page sections render, so the
 * catalog can never show a product that has no card (or hide one that does).
 */
export function buildCatalogoGrupos(input: {
  compite: Producto[]
  halfHybrid: Producto[]
  publico: Producto[]
}): CatalogoGrupo[] {
  return [
    grupo('compite', 'Compite', input.compite),
    grupo('half_hybrid', 'Experience · ½ Hybrid', input.halfHybrid),
    grupo('asiste', 'Asiste', input.publico),
  ].filter((g) => g.filas.length > 0)
}
