"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ReportingService } from "@/lib/reporting-service"
import { BookingService } from "@/lib/booking-service"
import { ReportData, BookingRequest } from "@/types/booking"
import Link from "next/link"

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("all")
  const [venueUtilization, setVenueUtilization] = useState<any[]>([])
  const [departmentPerformance, setDepartmentPerformance] = useState<any[]>([])

  useEffect(() => {
    // Initialize demo data and generate initial report
    BookingService.initializeDemoData()
    generateReport()
  }, [])

  const generateReport = () => {
    let reportStartDate = startDate
    let reportEndDate = endDate

    // Handle predefined periods
    if (selectedPeriod !== "custom") {
      const now = new Date()
      const start = new Date()
      
      switch (selectedPeriod) {
        case "today":
          start.setHours(0, 0, 0, 0)
          reportStartDate = start.toISOString().split('T')[0]
          reportEndDate = now.toISOString().split('T')[0]
          break
        case "week":
          start.setDate(now.getDate() - 7)
          reportStartDate = start.toISOString().split('T')[0]
          reportEndDate = now.toISOString().split('T')[0]
          break
        case "month":
          start.setMonth(now.getMonth() - 1)
          reportStartDate = start.toISOString().split('T')[0]
          reportEndDate = now.toISOString().split('T')[0]
          break
        case "quarter":
          start.setMonth(now.getMonth() - 3)
          reportStartDate = start.toISOString().split('T')[0]
          reportEndDate = now.toISOString().split('T')[0]
          break
        case "year":
          start.setFullYear(now.getFullYear() - 1)
          reportStartDate = start.toISOString().split('T')[0]
          reportEndDate = now.toISOString().split('T')[0]
          break
        default:
          reportStartDate = ""
          reportEndDate = ""
      }
    }

    const data = ReportingService.generateReport(reportStartDate, reportEndDate)
    setReportData(data)
    
    const utilization = ReportingService.getVenueUtilization()
    setVenueUtilization(utilization)
    
    const performance = ReportingService.getDepartmentPerformance()
    setDepartmentPerformance(performance)
  }

  const exportToCSV = () => {
    if (!reportData) return
    
    const allBookings = BookingService.getAllBookings()
    const csvContent = ReportingService.exportToCSV(allBookings)
    const filename = `booking-report-${new Date().toISOString().split('T')[0]}.csv`
    ReportingService.downloadCSV(csvContent, filename)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
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

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-sm text-gray-600">Comprehensive booking system analytics</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/">
                <Button variant="outline">Home</Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline">Back to Admin</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Period
                </label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {selectedPeriod === "custom" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </>
              )}
              
              <div className="flex items-end space-x-2">
                <Button onClick={generateReport} className="flex-1">
                  Generate Report
                </Button>
                <Button onClick={exportToCSV} variant="outline">
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">{reportData.totalBookings}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xl">📊</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-3xl font-bold text-green-600">{reportData.approvedBookings}</p>
                  <p className="text-xs text-gray-500">
                    {reportData.totalBookings > 0 
                      ? `${((reportData.approvedBookings / reportData.totalBookings) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl">✅</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">{reportData.rejectedBookings}</p>
                  <p className="text-xs text-gray-500">
                    {reportData.totalBookings > 0 
                      ? `${((reportData.rejectedBookings / reportData.totalBookings) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-xl">❌</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Processing</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {reportData.averageProcessingTime.toFixed(1)}
                  </p>
                  <p className="text-xs text-gray-500">days</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-xl">⏱️</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="venues">Venues</TabsTrigger>
            <TabsTrigger value="requesters">Top Requesters</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Bookings by Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Bookings by Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(reportData.bookingsByStatus).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(status)}>
                            {status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{count}</p>
                          <p className="text-xs text-gray-500">
                            {reportData.totalBookings > 0 
                              ? `${((count / reportData.totalBookings) * 100).toFixed(1)}%`
                              : '0%'
                            }
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(reportData.bookingsByMonth)
                      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                      .map(([month, count]) => (
                      <div key={month} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{month}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ 
                                width: `${reportData.totalBookings > 0 ? (count / Math.max(...Object.values(reportData.bookingsByMonth))) * 100 : 0}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="departments" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Department Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle>Bookings by Department</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(reportData.bookingsByDepartment)
                      .sort(([,a], [,b]) => b - a)
                      .map(([department, count]) => (
                      <div key={department} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{department}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ 
                                width: `${reportData.totalBookings > 0 ? (count / Math.max(...Object.values(reportData.bookingsByDepartment))) * 100 : 0}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Department Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Department Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departmentPerformance.map((dept) => (
                      <div key={dept.department} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold">{dept.department}</h4>
                          <Badge variant="outline">
                            {dept.approvalRate.toFixed(1)}% approval
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <p className="text-gray-600">Total</p>
                            <p className="font-bold">{dept.total}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600">Approved</p>
                            <p className="font-bold text-green-600">{dept.approved}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600">Rejected</p>
                            <p className="font-bold text-red-600">{dept.rejected}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="venues" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Venue Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle>Bookings by Venue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(reportData.bookingsByVenue)
                      .sort(([,a], [,b]) => b - a)
                      .map(([venue, count]) => (
                      <div key={venue} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{venue}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ 
                                width: `${reportData.totalBookings > 0 ? (count / Math.max(...Object.values(reportData.bookingsByVenue))) * 100 : 0}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Venue Utilization */}
              <Card>
                <CardHeader>
                  <CardTitle>Venue Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {venueUtilization.map((venue) => (
                      <div key={venue.venue} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-sm">{venue.venue}</h4>
                          <Badge variant="outline">
                            {venue.utilization.toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${venue.utilization}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {venue.bookings} bookings
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="requesters" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Requesters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.topRequesters.map((requester, index) => (
                    <div key={requester.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-semibold">{requester.name}</p>
                          <p className="text-sm text-gray-600">{requester.company}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{requester.count}</p>
                        <p className="text-xs text-gray-500">bookings</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.recentActivity.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h4 className="font-semibold">{booking.event}</h4>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p><span className="font-medium">Requester:</span> {booking.requesterName}</p>
                          <p><span className="font-medium">Company:</span> {booking.companyName}</p>
                          <p><span className="font-medium">Venue:</span> {booking.venueRequested}</p>
                          <p><span className="font-medium">Date:</span> {formatDate(booking.eventScheduleStartDate)}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <p>Submitted</p>
                        <p>{formatDateTime(booking.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
