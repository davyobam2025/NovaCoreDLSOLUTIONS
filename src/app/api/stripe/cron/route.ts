import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export async function GET() {
  try {
    const customers = await stripe.customers.list({ limit: 100 });

    for (const customer of customers.data) {
      if (!customer.email) continue;

      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: "all",
      });

      const hasActiveSub = subscriptions.data.some(sub => sub.status === "active");

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", customer.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, "users", userDoc.id), {
          isPremium: hasActiveSub,
        });
        console.log(`🔁 ${customer.email} : Premium = ${hasActiveSub}`);
      }
    }

    return new NextResponse('Mise à jour abonnements terminée.', { status: 200 });

  } catch (error) {
    console.error('❌ Erreur Cron Stripe:', error);
    return new NextResponse('Erreur serveur', { status: 500 });
  }
}
