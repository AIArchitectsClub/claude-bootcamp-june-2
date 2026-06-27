export const COURTS = [
  {
    id: 'court-1',
    name: 'Court 1 - Main',
    surface: 'Hard',
    indoor: false,
    description: 'Our flagship outdoor hard court with stadium seating.',
    image: null,
  },
  {
    id: 'court-2',
    name: 'Court 2 - Clay',
    surface: 'Clay',
    indoor: false,
    description: 'Classic red clay court, ideal for baseline play.',
    image: null,
  },
  {
    id: 'court-3',
    name: 'Court 3 - Indoor',
    surface: 'Hard',
    indoor: true,
    description: 'Covered hard court, playable in all weather conditions.',
    image: null,
  },
  {
    id: 'court-4',
    name: 'Court 4 - Grass',
    surface: 'Grass',
    indoor: false,
    description: 'Premium grass court. Available May–September.',
    image: null,
  },
]

// Time slots available each day (hourly, 7am–9pm)
export const TIME_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00',
]

export const SLOT_DURATION_HOURS = 1
