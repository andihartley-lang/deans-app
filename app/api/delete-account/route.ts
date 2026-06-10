import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.getUser(token);

  if (userError || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error: itemsError } = await supabaseAdmin
    .from("items")
    .delete()
    .eq("user_id", user.id);

  if (itemsError) {
    return Response.json({ error: itemsError.message }, { status: 500 });
  }

  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .delete()
    .eq("user_id", user.id);

  if (profileError) {
    return Response.json({ error: profileError.message }, { status: 500 });
  }

  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

  if (authError) {
    return Response.json({ error: authError.message }, { status: 500 });
  }

  return Response.json({ success: true });
}

export async function GET() {
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
