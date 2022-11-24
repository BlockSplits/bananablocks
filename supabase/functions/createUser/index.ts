// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { defaultHeaders } from "../../utils/constants.ts";
import { isValidAddress } from "../../utils/verifiers.ts";
import createDBClient from "../../utils/createDBClient.ts";
import { getAbsentFields, parseJSON } from "../../utils/transformations.ts";

console.log("Initializing createUser!");

serve(async (req) => {
  const jsonRequest = await parseJSON(req).catch((err) => err);
  if (jsonRequest instanceof Response) return jsonRequest;

  // Get missing fields and shows them back to the caller
  const fields = ["name", "address"];
  const filteredFields = getAbsentFields(fields, jsonRequest);

  if (filteredFields.length != 0) {
    return new Response("Failed to fetch mandatory field: " + filteredFields, {
      status: 400,
      headers: defaultHeaders,
    });
  }

  const { name, address } = jsonRequest;

  if (!isValidAddress(address)) {
    return new Response(
      "Invalid address. Should be hexadecimal 160-bit hash.",
      {
        status: 400,
        headers: defaultHeaders,
      }
    );
  }

  const supabaseClient = createDBClient(req.headers.get("Authorization")!);

  const users = await supabaseClient
    .from("users")
    .select()
    .eq("address", address);
  if (users.data && users.data.length != 0) {
    return new Response("User already exists.", {
      status: 400,
      headers: defaultHeaders,
    });
  }

  await supabaseClient.from("users").insert({
    name: name,
    address: address,
  });

  return new Response("User added.", {
    status: 201,
    headers: defaultHeaders,
  });
});

// To invoke:
// curl --request POST 'https://rxljsmfhpnrdqgqkfdqf.functions.supabase.co/createUser' \
//   --header 'Authorization: Bearer [YOUR TOKEN]' \
//   --header 'Content-Type: application/json' \
// --data '{"name":"bar", "address": "0x0acae68c9e57e568e986482af89102c9749e239d"}'
