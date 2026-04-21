export * from './brand-config';
export * from './theme-config';

import { getBrand, currentBrand } from './brand-config';
import { getTheme } from './theme-config';

/** Resolve the theme assigned to the active brand in one call. */
export function getActiveTheme() {
  return getTheme(getBrand(currentBrand).theme);
}
