"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingService } from "@/lib/booking-service"
import { BookingRequest } from "@/types/booking"
import Link from "next/link"

export default function AdminPage() {
  const searchParams = useSearchParams()
  const [bookings, setBookings] = useState<BookingRequest[]>([])
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null)
  const [approverName, setApproverName] = useState("V. Athiyodan - Soft Service Manager")
  const [rejectionReason, setRejectionReason] = useState("")
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)

  useEffect(() => {
    // Initialize demo data and load bookings
    BookingService.initializeDemoData()
    loadBookings()

    // If there's an ID in the URL, show that specific booking
    const bookingId = searchParams.get('id')
    if (bookingId) {
      const booking = BookingService.getBookingById(bookingId)
      if (booking) {
        setSelectedBooking(booking)
      }
    }
  }, [searchParams])

  const loadBookings = () => {
    const allBookings = BookingService.getAllBookings()
    setBookings(allBookings)
  }

  const handleApprove = async () => {
    if (!selectedBooking || !approverName.trim()) return
    
    setIsApproving(true)
    try {
      const updatedBooking = BookingService.approveBooking(selectedBooking.id, approverName)
      if (updatedBooking) {
        setSelectedBooking(updatedBooking)
        loadBookings()
        setShowApprovalDialog(false)
      }
    } catch (error) {
      console.error('Error approving booking:', error)
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    if (!selectedBooking || !approverName.trim()) return
    
    setIsRejecting(true)
    try {
      const updatedBooking = BookingService.rejectBooking(selectedBooking.id, approverName, rejectionReason)
      if (updatedBooking) {
        setSelectedBooking(updatedBooking)
        loadBookings()
        setShowRejectionDialog(false)
        setRejectionReason("")
      }
    } catch (error) {
      console.error('Error rejecting booking:', error)
    } finally {
      setIsRejecting(false)
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB')
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB')
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending')
  const approvedBookings = bookings.filter(b => b.status === 'approved')
  const rejectedBookings = bookings.filter(b => b.status === 'rejected')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Soft Service Manager Portal</h1>
              <p className="text-sm text-gray-600">Recreational Facility Booking Approvals - V. Athiyodan</p>
            </div>
          <div className="flex space-x-4">
              <Link href="/">
                <Button variant="outline">Home</Button>
              </Link>
              <Link href="/help-desk">
                <Button variant="outline">Help Desk</Button>
              </Link>
              <Link href="/reports">
                <Button variant="outline">Reports</Button>
              </Link>
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirm('Are you sure you want to delete ALL bookings? This action cannot be undone.')) {
                    BookingService.deleteAllBookings()
                    BookingService.deleteAllNotifications()
                    window.location.reload()
                  }
                }}
              >
                Delete All Data
              </Button>
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
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingBookings.length}</p>
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
                  <p className="text-2xl font-bold text-green-600">{approvedBookings.length}</p>
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
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{rejectedBookings.length}</p>
                </div>
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-sm">❌</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              Pending Review ({pendingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedBookings.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejectedBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Pending Requests List */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Requests Awaiting Review ({pendingBookings.length})
                </h2>
                
                {pendingBookings.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-500">No pending requests</p>
                    </CardContent>
                  </Card>
                ) : (
                  pendingBookings.map((booking) => (
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
                          <div className="flex space-x-2 items-center">
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status.toUpperCase()}
                            </Badge>
                            <button
                              className="text-red-600 hover:text-red-800 text-sm font-semibold"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this booking?')) {
                                  BookingService.deleteBooking(booking.id)
                                  loadBookings()
                                  if (selectedBooking?.id === booking.id) {
                                    setSelectedBooking(null)
                                  }
                                }
                              }}
                              aria-label="Delete booking"
                              title="Delete booking"
                            >
                              Delete
                            </button>
                          </div>
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

              {/* Request Review Panel */}
              <div className="lg:sticky lg:top-8">
                {selectedBooking ? (
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>Review Request</CardTitle>
                        <Badge className={getStatusColor(selectedBooking.status)}>
                          {selectedBooking.status.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Request Details - Matching the form format */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 bg-orange-200 px-2 py-1 rounded">
                          Section A: Requester Information
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">Name of Requester:</span>
                            <p>{selectedBooking.requesterName}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Request Initiated Date:</span>
                            <p>{selectedBooking.requestInitiatedDate}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Company Name:</span>
                            <p>{selectedBooking.companyName}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Designation:</span>
                            <p>{selectedBooking.designation}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Mobile number:</span>
                            <p>{selectedBooking.mobileNumber}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Email:</span>
                            <p>{selectedBooking.email}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Residence of NRC9:</span>
                            <p>{selectedBooking.residenceOfNRC9 ? 'Yes' : 'No'}</p>
                          </div>
                          {selectedBooking.unitNo && (
                            <div>
                              <span className="font-medium text-gray-600">Unit No:</span>
                              <p>{selectedBooking.unitNo}</p>
                            </div>
                          )}
                          {selectedBooking.unitLocation && (
                            <div>
                              <span className="font-medium text-gray-600">Unit Location:</span>
                              <p>{selectedBooking.unitLocation}</p>
                            </div>
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
                            <span className="font-medium text-gray-600">Venue Requested:</span>
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
                            <span className="font-medium text-gray-600">No. of Guests:</span>
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
                            <p className="text-gray-600 ml-4 text-xs">Details: {selectedBooking.avSystemDetails}</p>
                          )}
                          
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-600">F & B Services:</span>
                            <Badge variant={selectedBooking.fbServices ? "default" : "secondary"}>
                              {selectedBooking.fbServices ? "Yes" : "No"}
                            </Badge>
                          </div>
                          {selectedBooking.fbServicesDetails && (
                            <p className="text-gray-600 ml-4 text-xs">Details: {selectedBooking.fbServicesDetails}</p>
                          )}
                          
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-600">Chargeable:</span>
                            <Badge variant={selectedBooking.chargeable ? "default" : "secondary"}>
                              {selectedBooking.chargeable ? "Yes" : "No"}
                            </Badge>
                          </div>
                          {selectedBooking.chargeable && selectedBooking.chargeableAmount && (
                            <p className="text-gray-600 ml-4 text-xs">Amount: {selectedBooking.chargeableAmount} SAR</p>
                          )}
                          {selectedBooking.invoiceTo && (
                            <p className="text-gray-600 ml-4 text-xs">Invoice to: {selectedBooking.invoiceTo}</p>
                          )}
                        </div>
                      </div>

                      {/* Remarks */}
                      {selectedBooking.remarks && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Remarks</h4>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selectedBooking.remarks}</p>
                        </div>
                      )}

                      {/* Approval Actions */}
                      {selectedBooking.status === 'pending' && (
                        <div className="pt-4 border-t">
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Approver Name
                            </label>
                            <Input
                              value={approverName}
                              onChange={(e) => setApproverName(e.target.value)}
                              placeholder="Enter your name"
                            />
                          </div>
                          
                          <div className="flex space-x-3">
                            <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
                              <DialogTrigger asChild>
                                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                                  Approve Request
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Approve Booking Request</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p>Are you sure you want to approve this booking request?</p>
                                  <div className="bg-gray-50 p-4 rounded">
                                    <p><strong>Event:</strong> {selectedBooking.event}</p>
                                    <p><strong>Requester:</strong> {selectedBooking.requesterName}</p>
                                    <p><strong>Venue:</strong> {selectedBooking.venueRequested}</p>
                                    <p><strong>Date:</strong> {formatDate(selectedBooking.eventScheduleStartDate)}</p>
                                  </div>
                                  <div className="flex space-x-3">
                                    <Button 
                                      onClick={handleApprove} 
                                      disabled={isApproving || !approverName.trim()}
                                      className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                      {isApproving ? "Approving..." : "Confirm Approval"}
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      onClick={() => setShowApprovalDialog(false)}
                                      className="flex-1"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
                              <DialogTrigger asChild>
                                <Button variant="destructive" className="flex-1">
                                  Reject Request
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Reject Booking Request</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p>Please provide a reason for rejecting this booking request:</p>
                                  <div className="bg-gray-50 p-4 rounded">
                                    <p><strong>Event:</strong> {selectedBooking.event}</p>
                                    <p><strong>Requester:</strong> {selectedBooking.requesterName}</p>
                                    <p><strong>Venue:</strong> {selectedBooking.venueRequested}</p>
                                    <p><strong>Date:</strong> {formatDate(selectedBooking.eventScheduleStartDate)}</p>
                                  </div>
                                  <Textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Enter reason for rejection..."
                                    rows={3}
                                  />
                                  <div className="flex space-x-3">
                                    <Button 
                                      variant="destructive"
                                      onClick={handleReject} 
                                      disabled={isRejecting || !approverName.trim()}
                                      className="flex-1"
                                    >
                                      {isRejecting ? "Rejecting..." : "Confirm Rejection"}
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      onClick={() => {
                                        setShowRejectionDialog(false)
                                        setRejectionReason("")
                                      }}
                                      className="flex-1"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      )}

                      {/* Approval Status */}
                      {selectedBooking.status !== 'pending' && (
                        <div className="pt-4 border-t">
                          <h4 className="font-semibold text-gray-900 mb-3 bg-gray-200 px-2 py-1 rounded">
                            Section B: Recreational Department use only
                          </h4>
                          <div className="space-y-2 text-sm">
                            {selectedBooking.approvedBy && (
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <span className="font-medium text-gray-600">Approved by:</span>
                                  <p>{selectedBooking.approvedBy}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-600">Date:</span>
                                  <p>{selectedBooking.approvedDate}</p>
                                </div>
                              </div>
                            )}
                            {selectedBooking.departmentRemarks && (
                              <div>
                                <span className="font-medium text-gray-600">Remarks:</span>
                                <p className="bg-gray-50 p-2 rounded mt-1">{selectedBooking.departmentRemarks}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-gray-500">
                        Select a request from the list to review
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Approved Requests ({approvedBookings.length})
            </h2>
            
            {approvedBookings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No approved requests</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {booking.event}
                        </h3>
                        <Badge className={getStatusColor(booking.status)}>
                          APPROVED
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <p><span className="font-medium">Requester:</span> {booking.requesterName}</p>
                        <p><span className="font-medium">Venue:</span> {booking.venueRequested}</p>
                        <p><span className="font-medium">Date:</span> {formatDate(booking.eventScheduleStartDate)}</p>
                        <p><span className="font-medium">Approved by:</span> {booking.approvedBy}</p>
                        <p><span className="font-medium">Approved on:</span> {booking.approvedDate}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Rejected Requests ({rejectedBookings.length})
            </h2>
            
            {rejectedBookings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No rejected requests</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rejectedBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {booking.event}
                        </h3>
                        <Badge className={getStatusColor(booking.status)}>
                          REJECTED
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <p><span className="font-medium">Requester:</span> {booking.requesterName}</p>
                        <p><span className="font-medium">Venue:</span> {booking.venueRequested}</p>
                        <p><span className="font-medium">Date:</span> {formatDate(booking.eventScheduleStartDate)}</p>
                        <p><span className="font-medium">Rejected by:</span> {booking.approvedBy}</p>
                        <p><span className="font-medium">Rejected on:</span> {booking.approvedDate}</p>
                        {booking.departmentRemarks && (
                          <p><span className="font-medium">Reason:</span> {booking.departmentRemarks}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
