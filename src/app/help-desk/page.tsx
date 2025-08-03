"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingService } from "@/lib/booking-service"
import { BookingRequest, Notification } from "@/types/booking"
import Link from "next/link"

export default function HelpDeskPage() {
  const [bookings, setBookings] = useState<BookingRequest[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredBookings, setFilteredBookings] = useState<BookingRequest[]>([])
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null)

  useEffect(() => {
    // Initialize demo data and load bookings
    BookingService.initializeDemoData()
    loadData()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBookings(bookings)
    } else {
      const filtered = BookingService.searchBookings(searchQuery)
      setFilteredBookings(filtered)
    }
  }, [searchQuery, bookings])

  const loadData = () => {
    const allBookings = BookingService.getAllBookings()
    const allNotifications = BookingService.getAllNotifications()
    setBookings(allBookings)
    setFilteredBookings(allBookings)
    setNotifications(allNotifications)
  }

  const markNotificationAsRead = (notificationId: string) => {
    BookingService.markNotificationAsRead(notificationId)
    loadData()
  }

  const getStatusColor = (status: BookingRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB')
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB')
  }

  const unreadNotificationsCount = notifications.filter(n => !n.read).length
  const pendingRequestsCount = bookings.filter(b => b.status === 'pending').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Help Desk Dashboard</h1>
              <p className="text-sm text-gray-600">NRC9 FM Contractor - Recreational Facilities</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/">
                <Button variant="outline">Home</Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline">Soft Service Manager</Button>
              </Link>
              <Link href="/reports">
                <Button variant="outline">Reports</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">📋</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingRequestsCount}</p>
                </div>
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 text-sm">⏳</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {bookings.filter(b => b.status === 'approved').length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✅</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Notifications</p>
                  <p className="text-2xl font-bold text-red-600">{unreadNotificationsCount}</p>
                </div>
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-sm">🔔</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="requests">
              Booking Requests ({bookings.length})
            </TabsTrigger>
            <TabsTrigger value="notifications">
              Notifications ({unreadNotificationsCount} unread)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="p-6">
                <div className="flex space-x-4">
                  <Input
                    placeholder="Search by name, venue, event, or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear
                  </Button>
                  <Link href="/booking-request">
                    <Button>New Request</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Requests List */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  All Requests ({filteredBookings.length})
                </h2>
                
                {filteredBookings.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-500 mb-4">No booking requests found</p>
                      <Link href="/booking-request">
                        <Button>Create New Request</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  filteredBookings.map((booking) => (
                    <Card 
                      key={booking.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedBooking?.id === booking.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {booking.event}
                          </h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><span className="font-medium">Requester:</span> {booking.requesterName}</p>
                          <p><span className="font-medium">Company:</span> {booking.companyName}</p>
                          <p><span className="font-medium">Venue:</span> {booking.venueRequested}</p>
                          <p><span className="font-medium">Date:</span> {formatDate(booking.eventScheduleStartDate)}</p>
                          <p><span className="font-medium">Submitted:</span> {formatDateTime(booking.createdAt)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Request Details */}
              <div className="lg:sticky lg:top-8">
                {selectedBooking ? (
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>Request Details</CardTitle>
                        <div className="flex space-x-2">
                          <Badge className={getStatusColor(selectedBooking.status)}>
                            {selectedBooking.status.toUpperCase()}
                          </Badge>
                          {selectedBooking.status === 'pending' && (
                            <Link href={`/admin?id=${selectedBooking.id}`}>
                              <Button size="sm">Review</Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Key Information */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Requester:</span>
                          <p>{selectedBooking.requesterName}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Company:</span>
                          <p>{selectedBooking.companyName}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Email:</span>
                          <p>{selectedBooking.email}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Mobile:</span>
                          <p>{selectedBooking.mobileNumber}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="font-medium text-gray-600">Event:</span>
                          <p>{selectedBooking.event}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Venue:</span>
                          <p>{selectedBooking.venueRequested}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Date:</span>
                          <p>{formatDate(selectedBooking.eventScheduleStartDate)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Time:</span>
                          <p>{selectedBooking.eventStartTime} - {selectedBooking.eventEndTime}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Guests:</span>
                          <p>{selectedBooking.numberOfGuests}</p>
                        </div>
                      </div>

                      {/* Services */}
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold text-gray-900 mb-2">Services Required</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedBooking.avSystem && (
                            <Badge variant="outline">A/V System</Badge>
                          )}
                          {selectedBooking.fbServices && (
                            <Badge variant="outline">F&B Services</Badge>
                          )}
                          {selectedBooking.chargeable && (
                            <Badge variant="outline">Chargeable</Badge>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-4 border-t flex space-x-2">
                        <Link href={`/admin?id=${selectedBooking.id}`} className="flex-1">
                          <Button className="w-full">
                            {selectedBooking.status === 'pending' ? 'Review Request' : 'View Details'}
                          </Button>
                        </Link>
                        <Button variant="outline" onClick={() => {
                          const subject = `Re: ${selectedBooking.event} - Booking Request`
                          const body = `Dear ${selectedBooking.requesterName},\n\nRegarding your booking request for ${selectedBooking.venueRequested}...\n\nBest regards,\nNRC9 Help Desk`
                          window.location.href = `mailto:${selectedBooking.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
                        }}>
                          Email
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-500">
                        Select a request from the list to view details
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Notifications ({notifications.length})
              </h2>
              <Button 
                variant="outline" 
                onClick={() => {
                  notifications.forEach(n => {
                    if (!n.read) {
                      BookingService.markNotificationAsRead(n.id)
                    }
                  })
                  loadData()
                }}
              >
                Mark All as Read
              </Button>
            </div>

            {notifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No notifications</p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`${getNotificationColor(notification.type)} ${
                    !notification.read ? 'border-l-4' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{notification.title}</h3>
                          {!notification.read && (
                            <Badge variant="secondary" className="text-xs">New</Badge>
                          )}
                        </div>
                        <p className="text-sm mb-2">{notification.message}</p>
                        <p className="text-xs opacity-75">
                          {formatDateTime(notification.timestamp)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {notification.requestId && (
                          <Link href={`/admin?id=${notification.requestId}`}>
                            <Button size="sm" variant="outline">View</Button>
                          </Link>
                        )}
                        {!notification.read && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
