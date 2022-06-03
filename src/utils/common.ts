export function parseDbObject<T>(source: T): T {
  return JSON.parse(JSON.stringify(source, null, 4)) as T;
}

export function convertStringToNumber(value: string): number {
  return Number(value?.trim()?.replace(/,/g, ''));
}
