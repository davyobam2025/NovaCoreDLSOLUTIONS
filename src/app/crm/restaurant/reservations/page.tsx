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

export default function RestaurantReservations() {
  const [reservations, setReservations] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('restaurant_reservations')
        .select('*')

      const events = data?.map((r) => ({
        id: r.id,
        title: `Table ${r.table_numero} – ${r.client_nom}`,
        start: new Date(r.date_reservation),
        end: new Date(new Date(r.date_reservation).getTime() + 60 * 60 * 1000),
        resource: r,
      })) || []

      setReservations(events)
    }

    fetchData()
  }, [])

  const handleSelectSlot = async ({ start }) => {
    const nom = prompt('Nom du client ?')
    const table = prompt('Table ? (ex: A4)')

    if (!nom || !table) return

    const { data, error } = await supabase.from('restaurant_reservations').insert([{
      client_nom: nom,
      table_numero: table,
      date_reservation: start,
    }]).select().single()

    if (!error && data) {
      setReservations([
        ...reservations,
        {
          id: data.id,
          title: `Table ${table} – ${nom}`,
          start: new Date(data.date_reservation),
          end: new Date(new Date(data.date_reservation).getTime() + 60 * 60 * 1000),
          resource: data,
        },
      ])
    }
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-[#5C27FE] mb-6">📅 Réservations Restaurant</h1>

      <Calendar
        localizer={localizer}
        events={reservations}
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
