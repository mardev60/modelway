export interface Model {
  _id?: string;
  name: string;
  src_model: string;
  baseURL: string;
  provider_id: string;
  input_price: number;
  output_price: number;
  latency: number;
  last_ping: Date;
}