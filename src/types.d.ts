/// <reference types="vite-svg-loader" />

interface Reading {
  time?: string;
  date?: string;
  day_time: string;
  diastolic_bp: number;
  heart_rate: number;
  systolic_bp: number;
  timestamp: string;
  user_id: number;
  id: number;
  weather: WeatherReading;
}

interface WeatherReading {
  cloud_cover: number;
  condition: string;
  icon: string;
  precipitation: number;
  pressure: number;
  reading_id: number;
  relative_humidity: number;
  temperature: number;
  timestamp?: string;
}

interface ReadingInput {
  systolic_bp: number;
  diastolic_bp: number;
  heart_rate: number;
  timestamp: string;
  day_time: string;
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
  sort_by: string;
}

interface ReadingApiResponse {
  data: Reading[];
  meta: MetaData;
  params: GetParams;
}

interface MinMaxApiResponse {
  meta: {
    from: string;
    to: string;
  };
  data: MinMaxResult;
}

interface MinMaxResult {
  [index: string]: Reading;
}

interface TableDataObj {
  data: Reading[];
  color: boolean;
  currentPage: number;
  perPage: number;
  totalPages: number;
  currentDirection: string;
  currentOrderBy: HeaderKey;
  getter: (number?) => Promise<void>;
}

interface GetDataRequestBody {
  per_page: number;
  page: number;
  order: string;
  sort_by: string;
  to_date: Date;
  from_date: Date;
}

type ErrorString = "retry" | "cancel";

interface ErrorAction {
  name: ErrorString;
  func: () => void;
}

interface ErrorObj {
  severity: "info" | "warn" | "fatal";
  active: boolean;
  title: string;
  message: string;
  details: Response | string;
  options: ErrorAction[];
}

interface CardState {
  [index: number]: {
    collapse: boolean;
    weather: boolean;
    edit: boolean;
  };
}

interface ValueResult {
  confidence: ConfidenceVal
  result: number
}

interface ImageResult {
  diastolic_bp: ValueResult
  systolic_bp: ValueResult
  pulse: ValueResult
}

type HeaderKey =
  | "timestamp"
  | "day_time"
  | "diastolic_bp"
  | "heart_rate"
  | "systolic_bp"
  | "user_id"
  | "weather"
  | "date"
  | "time";

type ReadingVal = "diastolic_bp" | "systolic_bp" | "pulse";
type DayTimeStr = "morning" | "lunch" | "evening";
type ReadingValStr = "diastolic_bp" | "systolic_bp" | "heart_rate";
type Sortable = "timestamp" | ReadingValStr | "id";
type MethodString = "GET" | "DELETE" | "POST" | "PUT" | "PATCH";
type ConfidenceVal = 'high' | 'medium' | 'low'