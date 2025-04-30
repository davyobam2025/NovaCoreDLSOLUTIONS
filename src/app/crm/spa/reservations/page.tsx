'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const localizer = momentLocalizer(moment)

export default function SpaReservationsPage() {
  const [rdvs, setRdvs] = useState([])

  useEffect(() => {
    const fetchRDV = async () => {
      const { data } = await supabase.from('spa_reservations').select('*')

      const events = data?.map((rdv) => ({
        id: rdv.id,
        title: `${rdv.soin} – ${rdv.client_nom}`,
        start: new Date(rdv.date_rdv),
        end: new Date(new Date(rdv.date_rdv).getTime() + 60 * 60 * 1000),
        resource: rdv,
      })) || []

      setRdvs(events)
    }

    fetchRDV()
  }, [])

  const handleSelectSlot = async ({ start }) => {
    const nom = prompt('Nom du client ?')
    const soin = prompt('Type de soin ?')

    if (!nom || !soin) return

    const { data, error } = await supabase
      .from('spa_reservations')
      .insert([{ client_nom: nom, soin, date_rdv: start }])
      .select()
      .single()

    if (!error && data) {
      setRdvs([
        ...rdvs,
        {
          id: data.id,
          title: `${soin} – ${nom}`,
          start: new Date(data.date_rdv),
          end: new Date(new Date(data.date_rdv).getTime() + 60 * 60 * 1000),
          resource: data,
        },
      ])
    }
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-[#5C27FE] mb-6">📅 Planning des soins – Institut Beauté</h1>

      <Calendar
        localizer={localizer}
        events={rdvs}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        style={{ height: 600 }}
        views={['month', 'week', 'day']}
        popup
      />
    </div>
  )
}
