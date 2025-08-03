import { BookingRequest, Notification } from '@/types/booking'

const STORAGE_KEYS = {
  BOOKINGS: 'nrc9-bookings',
  NOTIFICATIONS: 'nrc9-notifications'
}

export class BookingService {
  // Booking CRUD operations
  static getAllBookings(): BookingRequest[] {
    if (typeof window === 'undefined') return []
    const bookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS)
    return bookings ? JSON.parse(bookings) : []
  }

  static getBookingById(id: string): BookingRequest | null {
    const bookings = this.getAllBookings()
    return bookings.find(booking => booking.id === id) || null
  }

  static createBooking(bookingData: Omit<BookingRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>): BookingRequest {
    const newBooking: BookingRequest = {
      ...bookingData,
      id: this.generateId(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const bookings = this.getAllBookings()
    bookings.push(newBooking)
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings))

    // Create notification for help desk
    this.createNotification({
      type: 'info',
      title: 'New Booking Request',
      message: `New facility booking request from ${bookingData.requesterName} for ${bookingData.venueRequested}`,
      requestId: newBooking.id
    })

    return newBooking
  }

  static updateBooking(id: string, updates: Partial<BookingRequest>): BookingRequest | null {
    const bookings = this.getAllBookings()
    const index = bookings.findIndex(booking => booking.id === id)
    
    if (index === -1) return null

    const updatedBooking = {
      ...bookings[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    bookings[index] = updatedBooking
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings))

    return updatedBooking
  }

  static approveBooking(id: string, approverName: string): BookingRequest | null {
    const booking = this.updateBooking(id, {
      status: 'approved',
      approved: true,
      approvedBy: approverName,
      approvedDate: new Date().toLocaleDateString('en-GB'),
      approvedSignature: approverName
    })

    if (booking) {
      // Notify requester
      this.createNotification({
        type: 'success',
        title: 'Booking Approved',
        message: `Your booking request for ${booking.venueRequested} has been approved`,
        requestId: id
      })

      // Notify help desk
      this.createNotification({
        type: 'success',
        title: 'Booking Approved',
        message: `Booking request from ${booking.requesterName} has been approved by ${approverName}`,
        requestId: id
      })
    }

    return booking
  }

  static rejectBooking(id: string, approverName: string, reason?: string): BookingRequest | null {
    const booking = this.updateBooking(id, {
      status: 'rejected',
      approved: false,
      approvedBy: approverName,
      approvedDate: new Date().toLocaleDateString('en-GB'),
      approvedSignature: approverName,
      departmentRemarks: reason || 'Request rejected'
    })

    if (booking) {
      // Notify requester
      this.createNotification({
        type: 'error',
        title: 'Booking Rejected',
        message: `Your booking request for ${booking.venueRequested} has been rejected. ${reason ? `Reason: ${reason}` : ''}`,
        requestId: id
      })

      // Notify help desk
      this.createNotification({
        type: 'warning',
        title: 'Booking Rejected',
        message: `Booking request from ${booking.requesterName} has been rejected by ${approverName}`,
        requestId: id
      })
    }

    return booking
  }

  // Delete operations
  static deleteBooking(id: string): boolean {
    const bookings = this.getAllBookings()
    const index = bookings.findIndex(booking => booking.id === id)
    
    if (index === -1) return false

    const deletedBooking = bookings[index]
    bookings.splice(index, 1)
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings))

    // Create notification for deletion
    this.createNotification({
      type: 'warning',
      title: 'Booking Deleted',
      message: `Booking request "${deletedBooking.event}" has been permanently deleted by admin`,
      requestId: id
    })

    return true
  }

  static deleteAllBookings(): boolean {
    try {
      localStorage.removeItem(STORAGE_KEYS.BOOKINGS)
      
      // Create notification for bulk deletion
      this.createNotification({
        type: 'warning',
        title: 'All Bookings Deleted',
        message: 'All booking records have been permanently deleted by admin'
      })

      return true
    } catch (error) {
      console.error('Error deleting all bookings:', error)
      return false
    }
  }

  static deleteAllNotifications(): boolean {
    try {
      localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS)
      return true
    } catch (error) {
      console.error('Error deleting all notifications:', error)
      return false
    }
  }

  static deleteBookingsByStatus(status: BookingRequest['status']): number {
    const bookings = this.getAllBookings()
    const bookingsToDelete = bookings.filter(booking => booking.status === status)
    const remainingBookings = bookings.filter(booking => booking.status !== status)
    
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(remainingBookings))

    // Create notification for status-based deletion
    this.createNotification({
      type: 'warning',
      title: `${status.charAt(0).toUpperCase() + status.slice(1)} Bookings Deleted`,
      message: `${bookingsToDelete.length} ${status} booking(s) have been permanently deleted by admin`
    })

    return bookingsToDelete.length
  }

  static deleteBookingsByDateRange(startDate: string, endDate: string): number {
    const bookings = this.getAllBookings()
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    const bookingsToDelete = bookings.filter(booking => {
      const bookingDate = new Date(booking.createdAt)
      return bookingDate >= start && bookingDate <= end
    })
    
    const remainingBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.createdAt)
      return !(bookingDate >= start && bookingDate <= end)
    })
    
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(remainingBookings))

    // Create notification for date range deletion
    this.createNotification({
      type: 'warning',
      title: 'Bookings Deleted by Date Range',
      message: `${bookingsToDelete.length} booking(s) from ${startDate} to ${endDate} have been permanently deleted by admin`
    })

    return bookingsToDelete.length
  }

  // Notification operations
  static getAllNotifications(): Notification[] {
    if (typeof window === 'undefined') return []
    const notifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)
    return notifications ? JSON.parse(notifications) : []
  }

  static createNotification(notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>): Notification {
    const newNotification: Notification = {
      ...notificationData,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      read: false
    }

    const notifications = this.getAllNotifications()
    notifications.unshift(newNotification) // Add to beginning
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications))

    return newNotification
  }

  static markNotificationAsRead(id: string): void {
    const notifications = this.getAllNotifications()
    const index = notifications.findIndex(notification => notification.id === id)
    
    if (index !== -1) {
      notifications[index].read = true
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications))
    }
  }

  static getUnreadNotificationsCount(): number {
    return this.getAllNotifications().filter(notification => !notification.read).length
  }

  // Utility methods
  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  static formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-GB')
  }

  static formatDateTime(date: string): string {
    return new Date(date).toLocaleString('en-GB')
  }

  // Search and filter methods
  static searchBookings(query: string): BookingRequest[] {
    const bookings = this.getAllBookings()
    const lowercaseQuery = query.toLowerCase()
    
    return bookings.filter(booking => 
      booking.requesterName.toLowerCase().includes(lowercaseQuery) ||
      booking.venueRequested.toLowerCase().includes(lowercaseQuery) ||
      booking.event.toLowerCase().includes(lowercaseQuery) ||
      booking.companyName.toLowerCase().includes(lowercaseQuery)
    )
  }

  static getBookingsByStatus(status: BookingRequest['status']): BookingRequest[] {
    return this.getAllBookings().filter(booking => booking.status === status)
  }

  static getBookingsByDateRange(startDate: string, endDate: string): BookingRequest[] {
    const bookings = this.getAllBookings()
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.eventScheduleStartDate)
      return bookingDate >= start && bookingDate <= end
    })
  }

  // Demo data initialization
  static initializeDemoData(): void {
    if (typeof window === 'undefined') return

    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      const demoBookings: Omit<BookingRequest, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          requesterName: 'Gouhar Karam',
          requestInitiatedDate: '27/July/2025',
          companyName: 'MAG',
          designation: 'SAFETY OFFICER',
          mobileNumber: '0571491662',
          email: 'g.karam@mag-sa.com',
          residenceOfNRC9: true,
          unitNo: 'FMB-025',
          unitLocation: 'FMB-Blk2-Bld1',
          venueRequested: 'Multipurpose Hall',
          event: 'Electrical Safety Awareness (LOTO) Training',
          eventScheduleStartDate: '2025-01-27',
          eventEndDate: '2025-01-27',
          eventStartTime: '14:00',
          eventEndTime: '16:30',
          numberOfGuests: 25,
          avSystem: true,
          avSystemDetails: 'Projector and sound system required',
          fbServices: false,
          chargeable: false,
          status: 'pending'
        }
      ]

      demoBookings.forEach(booking => {
        this.createBooking(booking)
      })
    }
  }
}
