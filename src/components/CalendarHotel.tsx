'use client'

import { useEffect, useState } from 'react'
import Timeline from 'react-calendar-timeline'
import moment from 'moment'
import { createClient } from '@supabase/supabase-js'
import 'react-calendar-timeline/lib/Timeline.css'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Chambre = {
  id: number
  numero: number
  type: string
}

type Reservation = {
  id: string
  client_prenom: string
  client_nom: string
  chambre_type: string
  date_arrivee: string
  date_depart: string
  statut: string
}

export default function CalendarHotel() {
  const [groups, setGroups] = useState<any[]>([])
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: chambres } = await supabase
        .from('chambres')
        .select('*')
        .order('numero')

      const { data: reservations } = await supabase
        .from('reservations')
        .select('*')

      if (!chambres || !reservations) return

      // 📌 Groupes = chambres
      const groupList = chambres.map((c: Chambre) => ({
        id: c.id,
        title: `Chambre ${c.numero} (${c.type})`
      }))

      // 📌 Items = réservations
      const itemList = reservations.map((r: Reservation, idx: number) => {
        const chambre = chambres.find((c) => c.type === r.chambre_type)
        return {
          id: r.id,
          group: chambre?.id,
          title: `${r.client_prenom} ${r.client_nom}`,
          start_time: moment(r.date_arrivee),
          end_time: moment(r.date_depart),
          itemProps: {
            style: {
              background:
                r.statut === 'confirmée'
                  ? '#22c55e'
                  : r.statut === 'annulée'
                  ? '#ef4444'
                  : '#facc15',
              color: 'black',
              borderRadius: 4,
              padding: '4px'
            }
          }
        }
      })

      setGroups(groupList)
      setItems(itemList)
    }

    fetchData()
  }, [])

  return (
    <div>
      <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={moment().subtract(2, 'days')}
        defaultTimeEnd={moment().add(14, 'days')}
        lineHeight={52}
        itemHeightRatio={0.9}
        canMove={false}
        canResize={false}
        stackItems
      />
    </div>
  )
}
