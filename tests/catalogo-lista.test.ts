import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { anchorIdForProducto, buildCatalogoGrupos } from '../src/lib/catalogoLista.ts'

type Fixture = { code: string; nombre: string; tipo: string }
const p = (code: string, nombre: string, tipo: string) => ({ code, nombre, tipo }) as unknown as Parameters<typeof buildCatalogoGrupos>[0]['compite'][number]

// Same order as src/data/catalogo.ts, which is NOT the order the catalog must show.
const compite: Fixture[] = [
  { code: 'DOB-VIE-MM', nombre: 'Dobles Mujeres', tipo: 'Dobles' },
  { code: 'IND-H', nombre: 'Individual Hombre (Open)', tipo: 'Individual' },
  { code: 'IND-M', nombre: 'Individual Mujer (Open)', tipo: 'Individual' },
  { code: 'DOB-SAB-HH', nombre: 'Dobles Hombres', tipo: 'Dobles' },
  { code: 'DOB-SAB-MH', nombre: 'Dobles Mixto', tipo: 'Dobles' },
  { code: 'REL-4H', nombre: 'Relay 4 Hombres', tipo: 'Relay' },
  { code: 'REL-4M', nombre: 'Relay 4 Mujeres', tipo: 'Relay' },
  { code: 'REL-2H2M', nombre: 'Relay Mixto 2H+2M', tipo: 'Relay' },
]
const half: Fixture[] = [
  { code: 'HALF-IND-M', nombre: '½ Hybrid Individual Mujer', tipo: '½ Hybrid Individual' },
  { code: 'HALF-IND-H', nombre: '½ Hybrid Individual Hombre', tipo: '½ Hybrid Individual' },
  { code: 'HALF-DOB-MM', nombre: '½ Hybrid Dobles Mujeres', tipo: '½ Hybrid Dobles' },
  { code: 'HALF-DOB-HH', nombre: '½ Hybrid Dobles Hombres', tipo: '½ Hybrid Dobles' },
  { code: 'HALF-DOB-MH', nombre: '½ Hybrid Dobles Mixto', tipo: '½ Hybrid Dobles' },
]
const publico: Fixture[] = [
  { code: 'PUB-VIE', nombre: 'Público — Viernes', tipo: 'Público' },
  { code: 'PUB-SAB', nombre: 'Público — Sábado', tipo: 'Público' },
]

const build = () =>
  buildCatalogoGrupos({
    compite: compite.map((f) => p(f.code, f.nombre, f.tipo)),
    halfHybrid: half.map((f) => p(f.code, f.nombre, f.tipo)),
    publico: publico.map((f) => p(f.code, f.nombre, f.tipo)),
  })

describe('catalog list', () => {
  it('shows three blocks in a single column order: Compite, Experience, Asiste', () => {
    const grupos = build()
    assert.deepEqual(
      grupos.map((g) => g.key),
      ['compite', 'half_hybrid', 'asiste'],
    )
    assert.deepEqual(
      grupos.map((g) => g.filas.length),
      [8, 5, 2],
    )
  })

  it('lists Individual first, then Dobles, then Relay inside Compite', () => {
    const codes = build()[0].filas.map((f) => f.producto.code)
    assert.deepEqual(codes, ['IND-H', 'IND-M', 'DOB-VIE-MM', 'DOB-SAB-HH', 'DOB-SAB-MH', 'REL-4H', 'REL-4M', 'REL-2H2M'])
  })

  it('keeps individual before doubles in Experience and the catalog order inside each type', () => {
    const codes = build()[1].filas.map((f) => f.producto.code)
    assert.deepEqual(codes, ['HALF-IND-M', 'HALF-IND-H', 'HALF-DOB-MM', 'HALF-DOB-HH', 'HALF-DOB-MH'])
  })

  it('shows Público Viernes before Sábado', () => {
    assert.deepEqual(
      build()[2].filas.map((f) => f.producto.code),
      ['PUB-VIE', 'PUB-SAB'],
    )
  })

  it('gives every row a unique anchor that matches the card id', () => {
    const anchors = build().flatMap((g) => g.filas.map((f) => f.anchorId))
    assert.equal(new Set(anchors).size, 15)
    assert.equal(anchorIdForProducto('IND-H'), 'cat-IND-H')
    assert.ok(anchors.every((id) => /^cat-[A-Z0-9-]+$/.test(id)))
  })

  it('tags each block with the experience it reports to analytics', () => {
    assert.deepEqual(
      build().map((g) => g.experience),
      ['compite', 'half_hybrid', 'asiste'],
    )
  })

  it('omits a block that has no products instead of showing an empty header', () => {
    const grupos = buildCatalogoGrupos({
      compite: compite.map((f) => p(f.code, f.nombre, f.tipo)),
      halfHybrid: [],
      publico: [],
    })
    assert.deepEqual(
      grupos.map((g) => g.key),
      ['compite'],
    )
  })

  it('does not mutate the lists it receives', () => {
    const input = compite.map((f) => p(f.code, f.nombre, f.tipo))
    const before = input.map((x) => x.code)
    buildCatalogoGrupos({ compite: input, halfHybrid: [], publico: [] })
    assert.deepEqual(
      input.map((x) => x.code),
      before,
    )
  })
})
