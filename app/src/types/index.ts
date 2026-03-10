export interface Asset {
  id: string
  name: string
  type: string
  location: string
  status: string
  last_updated: string
}

export interface Telemetry {
  asset_id: string
  timestamp: string
  temperature: number
  pressure: number
  vibration: number
  power_consumption: number
  status: string
}

export interface PowerDataPoint {
  timestamp: string
  power_kw: number
  efficiency: number
}

export interface PowerHistory {
  asset_id: string
  asset_name: string
  asset_type: string
  history: PowerDataPoint[]
  forecast: PowerDataPoint[]
  metadata: Record<string, unknown>
}
