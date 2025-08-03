"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">NRC9 FM Contractor</h1>
              <p className="text-sm text-gray-600">NEOM Residential Community-09</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/help-desk">
                <Button variant="outline">Help Desk</Button>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Recreational Facilities Reservation System
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Book recreational facilities and organize events for the NRC9 community. 
            Submit your requests through our streamlined booking system.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📝</span>
                <span>New Booking Request</span>
              </CardTitle>
              <CardDescription>
                Submit a new recreational facility reservation request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/booking-request">
                <Button className="w-full">Create Request</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📱</span>
                <span>QR Code Access</span>
              </CardTitle>
              <CardDescription>
                Scan QR code to quickly access the booking form
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/qr-access">
                <Button variant="outline" className="w-full">View QR Code</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📊</span>
                <span>Track Requests</span>
              </CardTitle>
              <CardDescription>
                Check the status of your submitted requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/track-requests">
                <Button variant="outline" className="w-full">Track Status</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Available Facilities */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Recreational Activities</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Swimming", "Soccer/Football", "Tennis", "Volleyball", "Football Court", "Dodgeball",
              "Gym & Fitness", "Fitness Activity Classes", "Billiards & Snooker",
              "Table Tennis", "Cycling", "Seasonal, Cultural & Religious Events",
              "Quiz Nights", "Movie Nights", "Sports Camps", "Farmer's Markets"
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <span className="text-green-600">✓</span>
                <span className="text-gray-700">{activity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 bg-slate-800 text-white rounded-lg p-8">
          <h3 className="text-xl font-bold mb-4">Need Help?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Help Desk</h4>
              <p className="text-slate-300">Visit our help desk for assistance with booking requests</p>
              <p className="text-slate-300">Email: nrc9.nz.helpdesk@mag-sa.com</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Recreation Department</h4>
              <p className="text-slate-300">For event planning and facility information</p>
              <p className="text-slate-300">Email: nrc9.nz.housing@mag-sa.com</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
