'use client'

import { useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const localizer = momentLocalizer(moment)

export default function CalendrierReservationsHotel() {
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    const fetchReservations = async () => {
      const session = await supabase.auth.getSession()
      const email = session.data.session?.user.email

      const { data: entreprise } = await supabase
        .from('entreprises')
        .select('id')
        .eq('email', email)
        .maybeSingle()

      const { data: reservations } = await supabase
        .from('reservations_hotel')
        .select('*, chambres_hotel(numero)')
        .eq('chambres_hotel.entreprise_id', entreprise?.id)

      const formattedEvents = (reservations || []).map((res: any) => ({
        title: `Chambre ${res.chambres_hotel.numero} - Client`,
        start: new Date(res.date_arrivee),
        end: new Date(res.date_depart),
        allDay: true
      }))

      setEvents(formattedEvents)
    }

    fetchReservations()
  }, [])

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold text-indigo-600 mb-4">📅 Réservations Hôtel</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        views={['month', 'week', 'day']}
      />
    </div>
  )
}
