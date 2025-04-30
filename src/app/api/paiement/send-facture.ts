import { Resend } from "resend";
import { generateFacturePDF } from "@/lib/pdf/facture";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const { paiement_id } = await req.json();

  // 🔍 Charger paiement + user
  const { data, error } = await supabase
    .from("paiements")
    .select("*, user:auth.users(email)")
    .eq("id", paiement_id)
    .single();

  if (!data || !data.user?.email) {
    return NextResponse.json({ error: "Utilisateur ou paiement introuvable" }, { status: 404 });
  }

  // Exemple ligne multiple à personnaliser dynamiquement
  const lignes = [
    { description: "Consultation IA avancée", montant: 6000 },
    { description: "Hébergement API", montant: 4000 },
  ];
  const total = lignes.reduce((acc, l) => acc + l.montant, 0);

  // Génération du PDF
  const pdf = await generateFacturePDF({
    facture_id: data.id,
    nom: data.user.email,
    email: data.user.email,
    montant: total,
    date: new Date(data.created_at).toLocaleString(),
    moyen: data.moyen,
    lignes,
    logoUrl: "https://yourdomain.com/logo.png" // facultatif
  });

  // 🔒 Stocker dans Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("factures")
    .upload(`facture-${data.id}.pdf`, new Blob([pdf]), {
      contentType: "application/pdf",
      upsert: true,
    });

  if (uploadError) console.error("❌ Erreur Storage :", uploadError);

  // 🔁 Email
  await resend.emails.send({
    from: "NovaCore <factures@novacore.com>",
    to: data.user.email,
    subject: "Votre facture NovaCore",
    html: "<p>Bonjour, voici votre facture en pièce jointe.</p>",
    attachments: [
      {
        filename: `facture-${data.id}.pdf`,
        content: Buffer.from(pdf).toString("base64"),
        type: "application/pdf",
      },
    ],
  });

  return NextResponse.json({ success: true });
}
