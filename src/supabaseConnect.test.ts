import { SupabaseConnection } from "./supabaseConnect";

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvbWZvaG9iY3d2cHJnd3pvZWR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjU0MDY2MTksImV4cCI6MTk4MDk4MjYxOX0.30KnA6ToNVvAwmstT47gJasbDriqRlV_IR8f561vfH0";
const SUPABASE_URL = "https://bomfohobcwvprgwzoedu.supabase.co";

describe("Test Connection", () => {
  test("Trivial Case", async () => {
    const supabaseConn = new SupabaseConnection(SUPABASE_KEY, SUPABASE_URL);
    const actual = (await supabaseConn.connection.from("groups").select()).data;
    const expected = [
      {
        id: 1,
        created_at: "2022-10-17T20:02:17+00:00",
        name: "ExampleName",
        description: "ExampleDescription",
      },
    ];
    expect(actual).toStrictEqual(expected);
  });
});
