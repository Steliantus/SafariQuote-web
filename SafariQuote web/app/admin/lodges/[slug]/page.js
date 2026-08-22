import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import LodgeEditor from "./LodgeEditor";

export default async function LodgeEditPage({ params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: lodge } = await supabase.from("lodges").select("*").eq("slug", slug).single();
  if (!lodge) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-1">{lodge.name}</h1>
      <p className="text-sm text-neutral-500 mb-6">{lodge.region}</p>
      <LodgeEditor lodge={lodge} />
    </div>
  );
}
