/**
 * Utility function to merge class names (similar to clsx/cn in NextJS)
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
