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

export default function PlanningCM() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('cm_posts').select('*')

      const mapped = data?.map((p) => ({
        id: p.id,
        title: `${p.titre} (${p.reseau})`,
        start: new Date(p.date_post),
        end: new Date(new Date(p.date_post).getTime() + 60 * 60 * 1000),
        resource: p,
      })) || []

      setPosts(mapped)
    }

    fetch()
  }, [])

  const handleSelectSlot = async ({ start }) => {
    const titre = prompt('Titre du post ?')
    const reseau = prompt('Réseau (Facebook, Instagram, LinkedIn...) ?')

    if (!titre || !reseau) return

    const { data, error } = await supabase
      .from('cm_posts')
      .insert([{ titre, reseau, date_post: start }])
      .select()
      .single()

    if (!error && data) {
      setPosts([
        ...posts,
        {
          id: data.id,
          title: `${data.titre} (${data.reseau})`,
          start: new Date(data.date_post),
          end: new Date(new Date(data.date_post).getTime() + 60 * 60 * 1000),
          resource: data,
        },
      ])
    }
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-[#5C27FE] mb-6">📅 Planning de publications réseaux</h1>

      <Calendar
        localizer={localizer}
        events={posts}
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
