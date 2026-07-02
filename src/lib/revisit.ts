import type { OverrideKey } from '../data/types'

// A problem needs revisiting when it's explicitly flagged, or when the user
// marked their last attempt as forgotten. Shared by App (the stat tile) and the
// ProblemBoard (the "needs revisit" filter) so the rule lives in one place.
export function isRevisit(get: (slug: string, key: OverrideKey) => string | undefined, slug: string): boolean {
  return get(slug, 'revisit') === '1' || get(slug, 'confidence') === 'forgot'
}
