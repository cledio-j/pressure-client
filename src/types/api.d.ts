export { }

declare module 'api' {



  interface TokenResponse {
    token: string
    expires: string
  }

  interface Reading {
    time?: string
    date?: string
    day_time: string
    diastolic_bp: number
    heart_rate: number
    systolic_bp: number
    timestamp: string
    user_id: number
    id: number
    weather: WeatherReading
  }

  interface WeatherReading {
    cloud_cover: number
    condition: string
    icon: string
    precipitation: number
    pressure: number
    reading_id: number
    relative_humidity: number
    temperature: number
    timestamp?: string
  }

  interface ReadingApiResponse {
    data: Reading[];
    meta: MetaData;
    params: GetParams;
  }

  interface NewReadingResponse {
    success: boolean
    reading: Reading
  }

  interface ModifyReadingResponse {
    success: boolean
    reading: Reading
  }

  interface DeletedReadingResponse{
    success: boolean
  }

  interface MetaData {
    page: number;
    total_pages: number;
    total: number;
  }

  interface GetParams {
    from_date: string;
    to_date: string;
    page: number;
    per_page: number;
    order: string;
    sort_by: keyof Reading;
  }

  type ValueKey = keyof Pick<typeof Reading, 'systolic_bp' | 'diastolic_bp' | 'heart_rate'>
}
