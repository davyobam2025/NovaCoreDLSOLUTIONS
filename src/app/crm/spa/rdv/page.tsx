'use client'

import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const localizer = momentLocalizer(moment)

export default function AgendaSpa() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchEvents = async () => {
      const session = await supabase.auth.getSession()
      const email = session.data.session?.user.email

      const { data: entreprise } = await supabase
        .from('entreprises')
        .select('id')
        .eq('email', email)
        .maybeSingle()

      const { data: rdvs } = await supabase
        .from('rdv_spa')
        .select('date_rdv, heure_rdv, soins_spa(nom), clients_spa(prenom, nom)')
        .eq('entreprise_id', entreprise?.id)

      const formattedEvents = rdvs?.map((rdv: any) => {
        const date = rdv.date_rdv
        const time = rdv.heure_rdv
        const start = new Date(`${date}T${time}`)
        const end = new Date(start.getTime() + 60 * 60 * 1000) // 1h par défaut
        return {
          title: `${rdv.soins_spa.nom} - ${rdv.clients_spa.prenom} ${rdv.clients_spa.nom}`,
          start,
          end
        }
      }) || []

      setEvents(formattedEvents)
    }

    fetchEvents()
  }, [])

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold text-pink-600 mb-6">📅 Agenda des RDV Spa</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        messages={{
          next: 'Suivant',
          previous: 'Précédent',
          today: "Aujourd'hui",
          month: 'Mois',
          week: 'Semaine',
          day: 'Jour',
          agenda: 'Agenda',
          date: 'Date',
          time: 'Heure',
          event: 'Soin',
        }}
      />
    </div>
  )
}
