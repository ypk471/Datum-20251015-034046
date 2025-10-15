export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface Document {
  id: string;
  personelName: string;
  name: string;
  startDate: number; // epoch millis
  endDate: number; // epoch millis
}