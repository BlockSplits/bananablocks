export function getAbsentFields(
  fields: string[],
  jsonRequest: { [key: string]: string }
) {
  const dict = Object.assign(
    {},
    ...fields.map((x) => ({ [x]: jsonRequest[x] }))
  );
  return Object.entries(dict)
    .filter(([k, v]) => !v)
    .map(([k, v]) => k);
}
