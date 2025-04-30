'use client'

import CalendarHotel from '../../components/CalendarHotel'

export default function DashboardHotel() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-pink-700 mb-4">🏨 Tableau de bord - Hôtel</h1>
      <CalendarHotel />
    </div>
  )
}
