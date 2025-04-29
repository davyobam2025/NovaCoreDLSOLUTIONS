'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import download from 'downloadjs'

export default function GenerateContractPage() {
  const { candidatId } = useParams()
  const [candidat, setCandidat] = useState({
    name: 'Samuel OBAM Davy',
    email: 'samuel@novaworld.ai'
  }) // mock pour test, à lier Supabase
  const [poste, setPoste] = useState('')
  const [salaire, setSalaire] = useState('')
  const [lieu, setLieu] = useState('')
  const [dateDebut, setDateDebut] = useState('')
  const [duree, setDuree] = useState('')

  const generatePDF = async () => {
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595, 842])
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

    const text = `
      Contrat de Travail - NovaWorld
      
      Employeur : DL Solutions (NovaCore)
      Candidat : ${candidat.name} (${candidat.email})
      
      Poste proposé : ${poste}
      Salaire : ${salaire}
      Lieu de travail : ${lieu}
      Début : ${dateDebut}
      Durée : ${duree}
      
      Conditions générales :
      Le présent contrat est soumis au droit du travail camerounais. Le candidat s'engage à respecter les obligations légales et éthiques de son poste. Toute rupture anticipée devra faire l’objet d’un préavis.

      Signature Employeur : ______________________

      Signature Candidat : ______________________
    `

    page.drawText(text, {
      x: 40,
      y: 750,
      size: 11,
      font,
      color: rgb(0, 0, 0),
      lineHeight: 15
    })

    const pdfBytes = await pdfDoc.save()
    download(pdfBytes, `contrat_${candidat.name}.pdf`, 'application/pdf')
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">Générer un contrat PDF</h1>
      <div className="space-y-6">
        <input
          type="text"
          placeholder="Poste"
          value={poste}
          onChange={(e) => setPoste(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Salaire mensuel (ex: 350 000 FCFA)"
          value={salaire}
          onChange={(e) => setSalaire(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Lieu de travail"
          value={lieu}
          onChange={(e) => setLieu(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <input
          type="date"
          value={dateDebut}
          onChange={(e) => setDateDebut(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Durée du contrat (ex: 12 mois renouvelable)"
          value={duree}
          onChange={(e) => setDuree(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <button
          onClick={generatePDF}
          className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition font-bold"
        >
          Générer et Télécharger le contrat
        </button>
      </div>
    </div>
  )
}
