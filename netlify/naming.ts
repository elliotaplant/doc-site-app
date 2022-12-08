export function serializeName(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-');
}
