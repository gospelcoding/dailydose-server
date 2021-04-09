export function uniq<T>(
  list: T[],
  compare: (a: T, b: T) => boolean = (a, b) => a == b
): T[] {
  return list.reduce(
    (final: T[], item) =>
      final.some(compItem => compare(item, compItem))
        ? final
        : [...final, item],
    []
  );
}

export function numSort(list: number[]) {
  list.sort((a, b) => a - b);
}
