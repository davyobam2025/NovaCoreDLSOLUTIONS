import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const candidatId = formData.get('candidatId') as string
  const poste = formData.get('poste') as string
  const salaire = formData.get('salaire') as string
  const date_debut = formData.get('date_debut') as string
  const lieu = formData.get('lieu') as string
  const duree = formData.get('duree') as string

  if (!file || !candidatId) return NextResponse.json({ error: 'Fichier ou ID manquant.' }, { status: 400 })

  const fileName = `contrats/${uuidv4()}.pdf`
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('documents')
    .upload(fileName, file, { contentType: 'application/pdf' })

  if (uploadError) {
    return NextResponse.json({ error: 'Erreur upload contrat.' }, { status: 500 })
  }

  const publicURL = supabase.storage.from('documents').getPublicUrl(fileName).data.publicUrl
  const codeContrat = 'CT-' + Math.floor(100000 + Math.random() * 900000)

  const { error } = await supabase.from('contrats').insert([{
    candidat_id: candidatId,
    poste, salaire, date_debut, lieu, duree,
    pdf_url: publicURL,
    code_contrat: codeContrat
  }])

  if (error) {
    return NextResponse.json({ error: 'Erreur sauvegarde Supabase' }, { status: 500 })
  }

  return NextResponse.json({ success: true, code: codeContrat, url: publicURL })
}
