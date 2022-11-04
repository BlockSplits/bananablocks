// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import createDBClient from "../../utils/createDBClient.ts";
import { isValidAddress } from "../../utils/verifiers.ts";
import { defaultHeaders } from "../../utils/constants.ts";
import { getAbsentFields } from "../../utils/transformations.ts";

console.log("Initializing createTransaction!");

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

  const fields = ["name", "total", "payer", "participants"];
  const filteredFields = getAbsentFields(fields, jsonRequest);

  if (filteredFields.length != 0) {
    return new Response("Failed to fetch mandatory field: " + filteredFields, {
      status: 400,
      headers: defaultHeaders,
    });
  }

  const { name, total, currency, payer, participants, creator } = jsonRequest;

  const supabaseClient = createDBClient(req.headers.get("Authorization")!);

  await supabaseClient.from("activity").insert({
    name,
    total: parseFloat(total),
    currency,
    payer,
    participants,
    creator: creator ?? "",
  });

  return new Response("Transaction created.", {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
});

// To invoke:
// curl --request POST 'https://rxljsmfhpnrdqgqkfdqf.functions.supabase.co/createTransaction' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4bGpzbWZocG5yZHFncWtmZHFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjcyMTExNjQsImV4cCI6MTk4Mjc4NzE2NH0.RyJ-0suUagzKHs22TA_8pUpgogHTyuiY-XgSgtwQoOg' \
//   --header 'Content-Type: application/json' \
// --data '{"name":"0xc2b21db29ce5a0705fe82132652ce58c7dabe638", "total": "1.2", "payer": "0xc2b21db29ce5a0705fe82132652ce58c7dabe638", "participants": "0xc2b21db29ce5a0705fe82132652ce58c7dabe638", "creator": "0xc2b21db29ce5a0705fe82132652ce58c7dabe638"}'
