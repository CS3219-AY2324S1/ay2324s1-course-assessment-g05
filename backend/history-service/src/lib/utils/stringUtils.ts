export function isCuid(id: string) {
  return /^[cdefghij][a-zA-Z0-9]{25}$/.test(id);
}
