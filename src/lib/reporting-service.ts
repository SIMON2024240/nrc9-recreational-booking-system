import { BookingRequest, ReportData } from '@/types/booking'
import { BookingService } from './booking-service'

export class ReportingService {
  static generateReport(startDate?: string, endDate?: string): ReportData {
    const allBookings = BookingService.getAllBookings()
    
    // Filter by date range if provided
    let filteredBookings = allBookings
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      filteredBookings = allBookings.filter(booking => {
        const bookingDate = new Date(booking.createdAt)
        return bookingDate >= start && bookingDate <= end
      })
    }

    const totalBookings = filteredBookings.length
    const approvedBookings = filteredBookings.filter(b => b.status === 'approved').length
    const rejectedBookings = filteredBookings.filter(b => b.status === 'rejected').length
    const pendingBookings = filteredBookings.filter(b => b.status === 'pending').length

    // Bookings by department (company)
    const bookingsByDepartment: { [key: string]: number } = {}
    filteredBookings.forEach(booking => {
      bookingsByDepartment[booking.companyName] = (bookingsByDepartment[booking.companyName] || 0) + 1
    })

    // Bookings by venue
    const bookingsByVenue: { [key: string]: number } = {}
    filteredBookings.forEach(booking => {
      bookingsByVenue[booking.venueRequested] = (bookingsByVenue[booking.venueRequested] || 0) + 1
    })

    // Bookings by status
    const bookingsByStatus = {
      'Approved': approvedBookings,
      'Rejected': rejectedBookings,
      'Pending': pendingBookings
    }

    // Bookings by month
    const bookingsByMonth: { [key: string]: number } = {}
    filteredBookings.forEach(booking => {
      const month = new Date(booking.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      })
      bookingsByMonth[month] = (bookingsByMonth[month] || 0) + 1
    })

    // Average processing time (for completed requests)
    const completedBookings = filteredBookings.filter(b => b.status !== 'pending')
    let totalProcessingTime = 0
    completedBookings.forEach(booking => {
      const created = new Date(booking.createdAt)
      const updated = new Date(booking.updatedAt)
      totalProcessingTime += (updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24) // days
    })
    const averageProcessingTime = completedBookings.length > 0 
      ? totalProcessingTime / completedBookings.length 
      : 0

    // Top requesters
    const requesterCounts: { [key: string]: { count: number; company: string } } = {}
    filteredBookings.forEach(booking => {
      if (requesterCounts[booking.requesterName]) {
        requesterCounts[booking.requesterName].count++
      } else {
        requesterCounts[booking.requesterName] = {
          count: 1,
          company: booking.companyName
        }
      }
    })

    const topRequesters = Object.entries(requesterCounts)
      .map(([name, data]) => ({
        name,
        count: data.count,
        company: data.company
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Recent activity (last 10 bookings)
    const recentActivity = filteredBookings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)

    return {
      totalBookings,
      approvedBookings,
      rejectedBookings,
      pendingBookings,
      bookingsByDepartment,
      bookingsByVenue,
      bookingsByStatus,
      bookingsByMonth,
      averageProcessingTime,
      topRequesters,
      recentActivity
    }
  }

  static exportToCSV(bookings: BookingRequest[]): string {
    const headers = [
      'ID',
      'Requester Name',
      'Company',
      'Designation',
      'Email',
      'Mobile',
      'Venue',
      'Event',
      'Event Date',
      'Start Time',
      'End Time',
      'Guests',
      'Status',
      'Approved By',
      'Approved Date',
      'Created At',
      'Updated At'
    ]

    const csvContent = [
      headers.join(','),
      ...bookings.map(booking => [
        booking.id,
        `"${booking.requesterName}"`,
        `"${booking.companyName}"`,
        `"${booking.designation}"`,
        `"${booking.email}"`,
        `"${booking.mobileNumber}"`,
        `"${booking.venueRequested}"`,
        `"${booking.event}"`,
        booking.eventScheduleStartDate,
        booking.eventStartTime,
        booking.eventEndTime,
        booking.numberOfGuests,
        booking.status,
        `"${booking.approvedBy || ''}"`,
        booking.approvedDate || '',
        booking.createdAt,
        booking.updatedAt
      ].join(','))
    ].join('\n')

    return csvContent
  }

  static downloadCSV(csvContent: string, filename: string) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  static getVenueUtilization(): { venue: string; bookings: number; utilization: number }[] {
    const allBookings = BookingService.getAllBookings()
    const venueBookings: { [key: string]: number } = {}
    
    allBookings.forEach(booking => {
      venueBookings[booking.venueRequested] = (venueBookings[booking.venueRequested] || 0) + 1
    })

    const totalBookings = allBookings.length
    
    return Object.entries(venueBookings).map(([venue, bookings]) => ({
      venue,
      bookings,
      utilization: totalBookings > 0 ? (bookings / totalBookings) * 100 : 0
    })).sort((a, b) => b.utilization - a.utilization)
  }

  static getDepartmentPerformance(): { department: string; total: number; approved: number; rejected: number; approvalRate: number }[] {
    const allBookings = BookingService.getAllBookings()
    const departmentStats: { [key: string]: { total: number; approved: number; rejected: number } } = {}
    
    allBookings.forEach(booking => {
      if (!departmentStats[booking.companyName]) {
        departmentStats[booking.companyName] = { total: 0, approved: 0, rejected: 0 }
      }
      
      departmentStats[booking.companyName].total++
      
      if (booking.status === 'approved') {
        departmentStats[booking.companyName].approved++
      } else if (booking.status === 'rejected') {
        departmentStats[booking.companyName].rejected++
      }
    })

    return Object.entries(departmentStats).map(([department, stats]) => ({
      department,
      total: stats.total,
      approved: stats.approved,
      rejected: stats.rejected,
      approvalRate: stats.total > 0 ? (stats.approved / stats.total) * 100 : 0
    })).sort((a, b) => b.total - a.total)
  }
}
