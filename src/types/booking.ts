export interface BookingRequest {
  id: string
  // Section A: Requester Information
  requesterName: string
  requestInitiatedDate: string
  companyName: string
  designation: string
  mobileNumber: string
  email: string
  residenceOfNRC9: boolean
  unitNo?: string
  unitLocation?: string
  
  // Event Details
  venueRequested: string
  event: string
  eventScheduleStartDate: string
  eventEndDate: string
  eventStartTime: string
  eventEndTime: string
  numberOfGuests: number
  
  // Services
  avSystem: boolean
  avSystemDetails?: string
  fbServices: boolean
  fbServicesDetails?: string
  chargeable: boolean
  chargeableAmount?: number
  invoiceTo?: string
  remarks?: string
  
  // Section B: Recreational Department use only
  requestHandledBy?: string
  requestHandledDate?: string
  requestHandledSignature?: string
  approvedBy?: string
  approvedDate?: string
  approvedSignature?: string
  approved?: boolean
  departmentRemarks?: string
  
  // System fields
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  timestamp: string
  read: boolean
  requestId?: string
}

export interface ReportData {
  totalBookings: number
  approvedBookings: number
  rejectedBookings: number
  pendingBookings: number
  bookingsByDepartment: { [key: string]: number }
  bookingsByVenue: { [key: string]: number }
  bookingsByStatus: { [key: string]: number }
  bookingsByMonth: { [key: string]: number }
  averageProcessingTime: number
  topRequesters: { name: string; count: number; company: string }[]
  recentActivity: BookingRequest[]
}

export const VENUES = [
  'Multipurpose Hall',
  'Swimming Pool',
  'Tennis Court',
  'Volleyball Court',
  'Football Court',
  'Gym & Fitness Center',
  'Billiards Room',
  'Table Tennis Room',
  'Cycling Track',
  'Outdoor Sports Area',
  'Community Garden',
  'Event Plaza'
] as const

export const COMPANIES = [
  'MAG',
  'NEOM',
  'Contractor Services',
  'Facility Management',
  'Other'
] as const

export const DESIGNATIONS = [
  'SAFETY OFFICER',
  'PROJECT MANAGER',
  'SUPERVISOR',
  'TECHNICIAN',
  'ADMINISTRATOR',
  'RESIDENT',
  'OTHER'
] as const
