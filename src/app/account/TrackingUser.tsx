'use client';

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { db } from "@/lib/firebaseClient";
import { doc, setDoc } from "firebase/firestore";

async function getIPInfo() {
  try {
    const res = await fetch('https://ipinfo.io/json?token=1d06fd38c6ea17');
    return await res.json();
  } catch (error) {
    console.error("Erreur IP Info:", error);
    return null;
  }
}

export default function TrackingUser() {
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    async function trackUser() {
      const ipInfo = await getIPInfo();

      await setDoc(doc(db, "visiteurs", user.id), {
        email: user.primaryEmailAddress?.emailAddress || "Inconnu",
        username: user.username || user.firstName || "Inconnu",
        phone: user.phoneNumbers?.[0]?.phoneNumber || "Non fourni",
        ip: ipInfo?.ip || "Inconnu",
        country: ipInfo?.country || "Inconnu",
        city: ipInfo?.city || "Inconnu",
        region: ipInfo?.region || "Inconnu",
        loc: ipInfo?.loc || "Inconnu", // Coordonnées GPS
        org: ipInfo?.org || "Inconnu", // FAI
        device: navigator.userAgent,
        createdAt: new Date(),
      });
    }

    trackUser();
  }, [user]);

  return null;
}
