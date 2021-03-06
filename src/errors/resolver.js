const registry = {};

export function registerResolver(type, resolver) {
  registry[type] = resolver;
}

export function resolve(type) {
  return registry[type];
}
