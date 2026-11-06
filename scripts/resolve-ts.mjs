// Lejon skriptet e Node-it të importojnë skedarë nga src/app, ku importet relative shkruhen pa
// prapashtesë (stili i Angular-it): nëse "./x" nuk gjendet, provohet "./x.ts".
export async function resolve(specifier, context, next) {
  try {
    return await next(specifier, context);
  } catch (err) {
    if (err?.code === 'ERR_MODULE_NOT_FOUND' && /^\.{1,2}\//.test(specifier)) {
      return next(`${specifier}.ts`, context);
    }
    throw err;
  }
}
