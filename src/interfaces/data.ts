export interface IBooking {
  id: string;
  booking_code: string;
  start_datetime: string;
  end_datetime: string;
  service_name: string;
  duration: string;
  status: string;
  start_date: string;
  start_time: string;
  timezone: string;
  agent: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
  };
  customer: {
    id: string;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    phone: string;
    custom_fields: {
      [key: string]: string;
    };
  };
  source_url: string;
  created_datetime: string;
  location: {
    id: string;
    name: string;
    full_address: string;
  };
}
