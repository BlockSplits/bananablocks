"use strict";
exports.__esModule = true;
var supabase_js_1 = require("@supabase/supabase-js");
// https://supabase.com/docs/reference/javascript/initializing
var SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbWZvaG9iY3d2cHJnd3pvZWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjU0MDY2MTksImV4cCI6MTk4MDk4MjYxOX0.30KnA6ToNVvAwmstT47gJasbDriqRlV_IR8f561vfH0";
var SUPABASE_URL = "https://bomfohobcwvprgwzoedu.supabase.co";
var options = {
    db: {
        schema: "public"
    },
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    },
    global: {
        headers: {}
    }
};
var supabase = (0, supabase_js_1.createClient)(SUPABASE_URL, SUPABASE_KEY, options); //process.env.SUPABASE_KEY);
var _a = await supabase.from("groups").select(), data = _a.data, error = _a.error;
console.log(data, error);
