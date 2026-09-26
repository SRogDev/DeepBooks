import { describe, it, expect } from "vitest"
import {
  shouldTriggerAmbient,
  AMBIENT_COOLDOWN_MS,
  AMBIENT_IDLE_MS,
  type TriggerState,
} from "./trigger"

function base(overrides: Partial<TriggerState> = {}): TriggerState {
  return {
    intensity: "suave",
    nowMs: 1_000_000,
    lastAmbientMs: null,
    idleMs: 0,
    atBoundary: false,
    ...overrides,
  }
}

describe("shouldTriggerAmbient", () => {
  it("nunca dispara cuando la intensidad está apagada", () => {
    expect(
      shouldTriggerAmbient(base({ intensity: "off", atBoundary: true })),
    ).toBe(false)
    expect(
      shouldTriggerAmbient(
        base({ intensity: "off", idleMs: 999_999, atBoundary: true }),
      ),
    ).toBe(false)
  })

  it("dispara al llegar al final de una sección (límite seguro)", () => {
    expect(shouldTriggerAmbient(base({ atBoundary: true }))).toBe(true)
  })

  it("respeta el cooldown por intensidad tras un momento reciente", () => {
    // suave: 20 min de cooldown; hace 5 min hubo un momento → no dispara
    expect(
      shouldTriggerAmbient(
        base({
          atBoundary: true,
          lastAmbientMs: 1_000_000 - 5 * 60_000,
        }),
      ),
    ).toBe(false)
    // hace 25 min → sí dispara
    expect(
      shouldTriggerAmbient(
        base({
          atBoundary: true,
          lastAmbientMs: 1_000_000 - 25 * 60_000,
        }),
      ),
    ).toBe(true)
  })

  it("activo usa un cooldown más corto (8 min)", () => {
    expect(
      shouldTriggerAmbient(
        base({
          intensity: "activo",
          atBoundary: true,
          lastAmbientMs: 1_000_000 - 7 * 60_000,
        }),
      ),
    ).toBe(false)
    expect(
      shouldTriggerAmbient(
        base({
          intensity: "activo",
          atBoundary: true,
          lastAmbientMs: 1_000_000 - 9 * 60_000,
        }),
      ),
    ).toBe(true)
  })

  it("dispara por inactividad solo al superar el umbral de la intensidad", () => {
    // suave: 120 s
    expect(
      shouldTriggerAmbient(base({ idleMs: 119_000, atBoundary: false })),
    ).toBe(false)
    expect(
      shouldTriggerAmbient(base({ idleMs: 120_000, atBoundary: false })),
    ).toBe(true)
    // activo: 45 s
    expect(
      shouldTriggerAmbient(
        base({ intensity: "activo", idleMs: 30_000, atBoundary: false }),
      ),
    ).toBe(false)
    expect(
      shouldTriggerAmbient(
        base({ intensity: "activo", idleMs: 45_000, atBoundary: false }),
      ),
    ).toBe(true)
  })

  it("no dispara a mitad de sección sin inactividad suficiente", () => {
    expect(
      shouldTriggerAmbient(base({ atBoundary: false, idleMs: 10_000 })),
    ).toBe(false)
  })

  it("dispara justo cuando se cumple el cooldown (límite inclusivo)", () => {
    expect(
      shouldTriggerAmbient(
        base({
          atBoundary: true,
          lastAmbientMs: 1_000_000 - AMBIENT_COOLDOWN_MS.suave,
        }),
      ),
    ).toBe(true)
  })

  it("expone los intervalos configurados por intensidad", () => {
    expect(AMBIENT_COOLDOWN_MS.suave).toBe(20 * 60_000)
    expect(AMBIENT_COOLDOWN_MS.activo).toBe(8 * 60_000)
    expect(AMBIENT_IDLE_MS.suave).toBe(120_000)
    expect(AMBIENT_IDLE_MS.activo).toBe(45_000)
  })
})
