import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/firebaseClient"; // Firestore connection
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
  } catch (err) {
    console.error('❌ Erreur de vérification signature Stripe:', err);
    return new NextResponse('Signature invalide', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_email;
    const subscriptionId = session.subscription as string;

    console.log("✅ Paiement réussi pour:", customerEmail);

    try {
      // Chercher l'utilisateur correspondant dans Firestore
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", customerEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];

        // Aller chercher la dernière facture Stripe de l'abonnement
        const invoices = await stripe.invoices.list({
          subscription: subscriptionId,
          limit: 1,
        });

        const invoice = invoices.data[0];
        const invoicePdf = invoice?.invoice_pdf;

        await updateDoc(doc(db, "users", userDoc.id), {
          isPremium: true,
          lastInvoiceUrl: invoicePdf || null, // 🔥 Stockage URL PDF Facture
        });

        console.log("🎉 Utilisateur PREMIUM activé + Facture attachée !");
      } else {
        console.error("❌ Aucun utilisateur trouvé avec cet email:", customerEmail);
      }

    } catch (err) {
      console.error('❌ Erreur mise à jour Firestore:', err);
    }
  }

  return new NextResponse('Webhook Stripe traité', { status: 200 });
}
