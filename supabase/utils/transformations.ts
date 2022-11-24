import { defaultHeaders } from "./constants.ts";

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

export async function parseJSON(req: Request) {
  var;
  return req.json().catch((e) => {
    throw new Response("Failed to parse JSON.", {
      status: 400,
      headers: defaultHeaders,
    });
  });
}
