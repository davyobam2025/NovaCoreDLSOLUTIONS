import { supabase } from "@/lib/supabase";
import { generateFacturePDF } from "@/lib/pdf/facture";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const { data, error } = await supabase
    .from("paiements")
    .select("*, user:auth.users(email)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Paiement introuvable" }, { status: 404 });
  }

  // Protection simple : à renforcer avec Clerk dans une vraie app
  const pdf = await generateFacturePDF({
    nom: data.user?.email || "Utilisateur",
    email: data.user?.email || "",
    montant: data.montant,
    moyen: data.moyen,
    date: new Date(data.created_at).toLocaleString(),
    facture_id: data.id,
  });

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="facture-${data.id}.pdf"`,
    },
  });
}
