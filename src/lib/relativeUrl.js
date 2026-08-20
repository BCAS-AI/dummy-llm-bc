// Implements the "Relative URL" canonicalization rules from the
// ABC OpenAPI OAuth & Signature documentation (Signature Symmetric section):
//  - path segments keep their slashes un-encoded
//  - unreserved characters (A-Z a-z 0-9 - _ . ~) are left as-is
//  - everything else (including comma) is percent-encoded, uppercase hex
//  - query params are sorted lexicographically by name, then by value

function encodeRfc3986(value) {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

function encodePath(pathname) {
  return pathname
    .split("/")
    .map((segment) => encodeRfc3986(segment))
    .join("/");
}

function canonicalizeRelativeUrl(rawPathAndQuery) {
  const [pathPart, queryPart] = rawPathAndQuery.split("?");
  const path = encodePath(pathPart);
  if (!queryPart) return path;

  const params = new URLSearchParams(queryPart);
  const entries = [...params.entries()].map(([key, value]) => [
    encodeRfc3986(key),
    encodeRfc3986(value),
  ]);

  entries.sort(([keyA, valueA], [keyB, valueB]) => {
    if (keyA !== keyB) return keyA < keyB ? -1 : 1;
    if (valueA !== valueB) return valueA < valueB ? -1 : 1;
    return 0;
  });

  const query = entries.map(([key, value]) => `${key}=${value}`).join("&");
  return `${path}?${query}`;
}

module.exports = { canonicalizeRelativeUrl };
