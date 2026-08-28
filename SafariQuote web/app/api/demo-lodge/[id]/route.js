import { NextResponse } from "next/server";
import { getDemoLodgeById } from "@/lib/demo";

// Client-side lodge lookups from QuoteBuilder.js need a fetchable endpoint
// for demo-tenant sessions, since lib/demo.js reads a JSON file off disk
// (Node `fs`) and can't be imported into a "use client" component. Mirrors
// the shape of `supabase.from("lodges").select("id, name, data").eq("id",
// id).single()` so QuoteBuilder can treat both sources identically.
export async function GET(_request, { params }) {
    const { id } = await params;
    const lodge = getDemoLodgeById(id);
    if (!lodge) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json(lodge);
}
