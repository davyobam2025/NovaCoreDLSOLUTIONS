import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface CandidateScoringResult {
  score: number;        // Score de 0 à 100
  summary: string;      // Résumé de la compatibilité
  strengths: string[];  // Points forts
  weaknesses: string[]; // Points faibles
}

/**
 * Analyse un CV et calcule un score de compatibilité avec une offre d'emploi.
 * @param cvText Texte brut du CV
 * @param jobRequirements Description détaillée du poste à pourvoir
 * @returns Un objet structuré avec score, résumé, forces, faiblesses
 */
export async function scoreCandidate(cvText: string, jobRequirements: string): Promise<CandidateScoringResult> {
  const prompt = `
Tu es un expert RH international et un spécialiste en intelligence artificielle de recrutement. 
Analyse le profil suivant avec un regard critique et professionnel.

Offre d'emploi :
${jobRequirements}

Curriculum Vitae candidat :
${cvText}

Instructions :
- Note le candidat sur 100% de correspondance au poste.
- Résume en 3 phrases la compatibilité globale.
- Liste 3 points forts majeurs du candidat.
- Liste 3 faiblesses ou éléments manquants importants.

Réponds sous ce format JSON strict :

{
  "score": 0-100,
  "summary": "Résumé de la compatibilité",
  "strengths": ["force 1", "force 2", "force 3"],
  "weaknesses": ["faiblesse 1", "faiblesse 2", "faiblesse 3"]
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  try {
    const jsonResponse = response.choices[0].message.content || '{}';
    const parsed: CandidateScoringResult = JSON.parse(jsonResponse);
    return parsed;
  } catch (error) {
    console.error("Erreur lors du parsing du scoring IA:", error);
    throw new Error("Impossible d'analyser la réponse IA pour le scoring du candidat.");
  }
}
