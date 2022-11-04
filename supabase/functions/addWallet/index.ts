// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

import createDBClient from "../../utils/createDBClient.ts";
import { isValidAddress } from "../../utils/verifiers.ts";
import { getAbsentFields } from "../../utils/transformations.ts";

console.log("Initializing addWallet!");
const defaultHeaders = { "Content-Type": "application/text" };

serve(async (req) => {
  let jsonRequest: { [key: string]: string };
  try {
    jsonRequest = await req.json();
  } catch (e) {
    return new Response("Failed to parse JSON.", {
      status: 400,
      headers: defaultHeaders,
    });
  }

  const fields = ["originalAddress", "newAddress"];
  const filteredFields = getAbsentFields(fields, jsonRequest);

  if (filteredFields.length != 0) {
    return new Response("Failed to fetch mandatory field: " + filteredFields, {
      status: 400,
      headers: defaultHeaders,
    });
  }

  const { originalAddress, newAddress } = jsonRequest;

  if (!isValidAddress(newAddress)) {
    return new Response(
      "Invalid address. Should be hexadecimal 160-bit hash.",
      {
        status: 400,
        headers: defaultHeaders,
      }
    );
  }

  const supabaseClient = createDBClient(req.headers.get("Authorization")!);

  const fromDB = await supabaseClient
    .from("users")
    .select()
    .eq("address", originalAddress);
  const users = fromDB.data!;
  if (users && users.length == 0) {
    return new Response("User does not exist.", {
      status: 400,
      headers: defaultHeaders,
    });
  }
  const [user] = users;
  if (user.addresses && user.addresses.includes(newAddress)) {
    return new Response("Address already added.", {
      status: 400,
      headers: defaultHeaders,
    });
  }
  const newAddresses = user.addresses.concat(", " + newAddress);
  console.log("Updated addresses: ", newAddresses);

  await supabaseClient
    .from("users")
    .update({ addresses: newAddresses })
    .eq("address", originalAddress);

  return new Response("Wallet added.", {
    headers: defaultHeaders,
  });
});

// To invoke:
// curl --request POST 'https://rxljsmfhpnrdqgqkfdqf.functions.supabase.co/addWallet' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4bGpzbWZocG5yZHFncWtmZHFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjcyMTExNjQsImV4cCI6MTk4Mjc4NzE2NH0.RyJ-0suUagzKHs22TA_8pUpgogHTyuiY-XgSgtwQoOg' \
//   --header 'Content-Type: application/json' \
// --data '{"originalAddress":"0xc2b21db29ce5a0705fe82132652ce58c7dabe638", "newAddress": "0x2f8e0806f12b1fb6675dce1e60462498e9945366"}'
