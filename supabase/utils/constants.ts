const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
};
export const defaultHeaders = {
  ...corsHeaders,
  "Content-Type": "application/text",
};
