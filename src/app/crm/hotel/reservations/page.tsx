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

export default function ReservationCalendarPage() {
  const [reservations, setReservations] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('hotel_reservations').select('*, client:client_id(nom)')
      if (data) {
        const events = data.map((r) => ({
          id: r.id,
          title: `${r.client?.nom} – ${r.chambre}`,
          start: new Date(r.date_debut),
          end: new Date(r.date_fin),
          resource: r
        }))
        setReservations(events)
      }
    }

    fetchData()
  }, [])

  const handleSelectSlot = async ({ start, end }) => {
    const nomClient = prompt('Nom du client ?')
    const chambre = prompt('Chambre ? (ex: 203)')

    if (!nomClient || !chambre) return

    // Créer ou trouver client
    const { data: existing } = await supabase
      .from('hotel_clients')
      .select('id')
      .eq('nom', nomClient)
      .single()

    const clientId = existing?.id || (
      await supabase.from('hotel_clients').insert([{ nom: nomClient }]).select('id').single()
    ).data?.id

    const { data } = await supabase.from('hotel_reservations').insert([{
      client_id: clientId,
      date_debut: start,
      date_fin: end,
      chambre
    }]).select().single()

    if (data) {
      setReservations([...reservations, {
        id: data.id,
        title: `${nomClient} – ${chambre}`,
        start: new Date(data.date_debut),
        end: new Date(data.date_fin),
        resource: data
      }])
    }
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">📅 Réservations Hôtelières</h1>
      <Calendar
        localizer={localizer}
        events={reservations}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        style={{ height: 600 }}
        popup
        views={['month', 'week', 'day']}
      />
    </div>
  )
}
