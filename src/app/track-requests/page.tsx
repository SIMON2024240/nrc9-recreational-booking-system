"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BookingService } from "@/lib/booking-service"
import { BookingRequest } from "@/types/booking"
import Link from "next/link"

export default function TrackRequestsPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [bookings, setBookings] = useState<BookingRequest[]>([])
  const [filteredBookings, setFilteredBookings] = useState<BookingRequest[]>([])
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null)

  useEffect(() => {
    // Initialize demo data and load bookings
    BookingService.initializeDemoData()
    const allBookings = BookingService.getAllBookings()
    setBookings(allBookings)
    setFilteredBookings(allBookings)

    // If there's an ID in the URL, show that specific booking
    const bookingId = searchParams.get('id')
    if (bookingId) {
      const booking = BookingService.getBookingById(bookingId)
      if (booking) {
        setSelectedBooking(booking)
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBookings(bookings)
    } else {
      const filtered = BookingService.searchBookings(searchQuery)
      setFilteredBookings(filtered)
    }
  }, [searchQuery, bookings])

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB')
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                ← Back to Home
              </Link>
            </div>
            <div>
              <Link href="/booking-request">
                <Button>New Request</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Track Booking Requests
          </h1>
          <p className="text-lg text-gray-600">
            Monitor the status of your recreational facility booking requests
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8">
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
                    <Button>Create Your First Request</Button>
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
                    <Badge className={getStatusColor(selectedBooking.status)}>
                      {selectedBooking.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Requester Information */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 bg-orange-200 px-2 py-1 rounded">
                      Requester Information
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Name:</span>
                        <p>{selectedBooking.requesterName}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Company:</span>
                        <p>{selectedBooking.companyName}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Designation:</span>
                        <p>{selectedBooking.designation}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Mobile:</span>
                        <p>{selectedBooking.mobileNumber}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium text-gray-600">Email:</span>
                        <p>{selectedBooking.email}</p>
                      </div>
                      {selectedBooking.unitNo && (
                        <>
                          <div>
                            <span className="font-medium text-gray-600">Unit No:</span>
                            <p>{selectedBooking.unitNo}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Unit Location:</span>
                            <p>{selectedBooking.unitLocation}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Event Details */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 bg-orange-200 px-2 py-1 rounded">
                      Event Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Venue:</span>
                        <p>{selectedBooking.venueRequested}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Event:</span>
                        <p>{selectedBooking.event}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="font-medium text-gray-600">Start Date:</span>
                          <p>{formatDate(selectedBooking.eventScheduleStartDate)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">End Date:</span>
                          <p>{formatDate(selectedBooking.eventEndDate)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Start Time:</span>
                          <p>{selectedBooking.eventStartTime}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">End Time:</span>
                          <p>{selectedBooking.eventEndTime}</p>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Number of Guests:</span>
                        <p>{selectedBooking.numberOfGuests}</p>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 bg-orange-200 px-2 py-1 rounded">
                      Services
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-600">A/V System:</span>
                        <Badge variant={selectedBooking.avSystem ? "default" : "secondary"}>
                          {selectedBooking.avSystem ? "Yes" : "No"}
                        </Badge>
                      </div>
                      {selectedBooking.avSystemDetails && (
                        <p className="text-gray-600 ml-4">{selectedBooking.avSystemDetails}</p>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-600">F&B Services:</span>
                        <Badge variant={selectedBooking.fbServices ? "default" : "secondary"}>
                          {selectedBooking.fbServices ? "Yes" : "No"}
                        </Badge>
                      </div>
                      {selectedBooking.fbServicesDetails && (
                        <p className="text-gray-600 ml-4">{selectedBooking.fbServicesDetails}</p>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-600">Chargeable:</span>
                        <Badge variant={selectedBooking.chargeable ? "default" : "secondary"}>
                          {selectedBooking.chargeable ? "Yes" : "No"}
                        </Badge>
                      </div>
                      {selectedBooking.chargeable && selectedBooking.chargeableAmount && (
                        <p className="text-gray-600 ml-4">Amount: {selectedBooking.chargeableAmount} SAR</p>
                      )}
                    </div>
                  </div>

                  {/* Approval Status */}
                  {selectedBooking.status !== 'pending' && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 bg-gray-200 px-2 py-1 rounded">
                        Approval Status
                      </h4>
                      <div className="space-y-2 text-sm">
                        {selectedBooking.approvedBy && (
                          <div>
                            <span className="font-medium text-gray-600">Reviewed by:</span>
                            <p>{selectedBooking.approvedBy}</p>
                          </div>
                        )}
                        {selectedBooking.approvedDate && (
                          <div>
                            <span className="font-medium text-gray-600">Review Date:</span>
                            <p>{selectedBooking.approvedDate}</p>
                          </div>
                        )}
                        {selectedBooking.departmentRemarks && (
                          <div>
                            <span className="font-medium text-gray-600">Remarks:</span>
                            <p>{selectedBooking.departmentRemarks}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Remarks */}
                  {selectedBooking.remarks && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Remarks</h4>
                      <p className="text-sm text-gray-600">{selectedBooking.remarks}</p>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="pt-4 border-t text-xs text-gray-500">
                    <p>Submitted: {formatDateTime(selectedBooking.createdAt)}</p>
                    <p>Last Updated: {formatDateTime(selectedBooking.updatedAt)}</p>
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
      </main>
    </div>
  )
}
