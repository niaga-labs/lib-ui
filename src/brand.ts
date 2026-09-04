/**
 * The one place lib-ui says the product's name.
 *
 * Before NIAGA-109 the brand was typed out in four components, so a rename
 * meant finding all four -- and the 2026-09-02 Desa Murni Batik -> Niaga
 * rename is still visible in eighteen repos precisely because that kind of
 * string has no single home (NIAGA-110).
 *
 * Every component that shows the brand takes it as a prop defaulting to one of
 * these, so a consumer can override per app without lib-ui growing a config
 * system (this ticket's explicit "do not").
 */

/** The product name on its own. */
export const BRAND_NAME = 'Niaga';

/** "<brand> Admin", the back-office surface. */
export const BRAND_ADMIN = `${BRAND_NAME} Admin`;

/** "<brand> Warehouse", the picking/packing PWA. */
export const BRAND_WAREHOUSE = `${BRAND_NAME} Warehouse`;
