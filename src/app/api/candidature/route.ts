import { NextRequest, NextResponse } from 'next/server'
import { scoreCandidate } from '@/lib/ai/scoring'
import pdfParse from 'pdf-parse'
import { createClient } from '@supabase/supabase-js'

// Initialisation Supabase (à sécuriser par ENV)
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Fonction POST (recevoir une candidature)
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('cv') as File
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string
    const jobId = formData.get('jobId') as string

    if (!file || !name || !email || !message || !jobId) {
      return NextResponse.json({ error: 'Données manquantes.' }, { status: 400 })
    }

    // Lire le fichier PDF (extraction texte brut)
    const buffer = Buffer.from(await file.arrayBuffer())
    const parsedPDF = await pdfParse(buffer)
    const cvText = parsedPDF.text

    if (!cvText || cvText.length < 100) {
      return NextResponse.json({ error: 'CV illisible ou trop court.' }, { status: 400 })
    }

    // Appel IA pour scoring
    const scoringResult = await scoreCandidate(cvText, `Offre ID: ${jobId}, description métier.`)

    // Stocker dans Supabase
    const { data, error } = await supabase
      .from('candidatures')
      .insert([{
        job_id: jobId,
        candidate_name: name,
        candidate_email: email,
        candidate_message: message,
        candidate_cv_text: cvText,
        score: scoringResult.score,
        strengths: scoringResult.strengths,
        weaknesses: scoringResult.weaknesses,
        summary: scoringResult.summary
      }])

    if (error) {
      console.error('Erreur insertion Supabase:', error)
      return NextResponse.json({ error: 'Erreur d\'enregistrement.' }, { status: 500 })
    }

    return NextResponse.json({ success: true, score: scoringResult.score, summary: scoringResult.summary }, { status: 200 })

  } catch (error) {
    console.error('Erreur API candidature:', error)
    return NextResponse.json({ error: 'Erreur serveur interne.' }, { status: 500 })
  }
}
