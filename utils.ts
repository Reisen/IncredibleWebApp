// Safer URL navigation.

type ParseUrlParams<url> =
  url extends `${infer path}(${infer optionalPath})`
    ? ParseUrlParams<path> & Partial<ParseUrlParams<optionalPath>>
    : url extends `${infer start}/${infer rest}`
    ? ParseUrlParams<start> & ParseUrlParams<rest>
    : url extends `:${infer param}`
    ? { [k in param]: string }
    : {};

export function redirect<T extends string>(
    p: T,
    a: ParseUrlParams<T>,
    r: express.Response,
) {
  r.redirect(301, Object.entries<string>(a).reduce<string>(
    (p, [key, value]) => p.replace(`:${key}`, value),
    p
  ).replace(/(\(|\)|\/?:[^\/]+)/g, ''))
}
