export type DayItem = {
  time?: string
  type: 'sight' | 'food' | 'hotel' | 'transfer' | 'other'
  title: string
  address?: string
  notes?: string
  costEstimate?: number
  geo?: { lng: number; lat: number }
}

export type ItineraryDay = {
  date?: string
  city?: string
  items: DayItem[]
}

export type Itinerary = {
  destination: string
  days: number
  budgetEstimate?: number
  people?: number
  currency?: string
  preferences?: string[]
  plan: ItineraryDay[]
}












