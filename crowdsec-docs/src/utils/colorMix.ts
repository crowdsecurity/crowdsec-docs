/** Returns a `color-mix(in srgb, …)` expression for tinting with transparency. */
export const mix = (color: string, pct: number) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;
