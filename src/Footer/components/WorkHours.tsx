import React from 'react'

type WorkHour = {
  day: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[]
  start: string
  end: string
  id?: string | null
}

const dayShort: Record<string, string> = {
  Monday: 'L',
  Tuesday: 'Ma',
  Wednesday: 'Mi',
  Thursday: 'J',
  Friday: 'V',
  Saturday: 'S',
  Sunday: 'D',
}

const dayLong: Record<string, string> = {
  Monday: 'Luni',
  Tuesday: 'Marți',
  Wednesday: 'Miercuri',
  Thursday: 'Joi',
  Friday: 'Vineri',
  Saturday: 'Sâmbătă',
  Sunday: 'Duminică',
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function joinDays(days: string[], map: Record<string, string>, sep = '-') {
  if (days.length === 1) return map[days[0]]
  return map[days[0]] + sep + map[days[days.length - 1]]
}

export function WorkHours({
  data,
  variant = 'short',
}: {
  data: WorkHour[]
  variant?: 'short' | 'long'
}) {
  if (!data?.length) return null

  if (variant === 'short') {
    // Example: L-V: 08:00-18:00, S: 08:00-15:00
    return (
      <span>
        {data
          .map(
            (item) =>
              `${joinDays(item.day, dayShort)}: ${formatTime(item.start)}-${formatTime(item.end)}`,
          )
          .join(', ')}
      </span>
    )
  }

  // long variant
  // Example: Luni – vineri: 08:00 – 18:00\nSâmbătă: 08:00 – 15.00
  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>
          {joinDays(item.day, dayLong, ' – ')}: {formatTime(item.start)} – {formatTime(item.end)}
        </div>
      ))}
    </div>
  )
}
