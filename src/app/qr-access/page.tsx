"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function QRAccessPage() {
  const [qrCodeUrl, setQrCodeUrl] = useState("")

  useEffect(() => {
    // Generate QR code URL for the booking form
    const bookingUrl = `${window.location.origin}/booking-request`
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(bookingUrl)}`
    setQrCodeUrl(qrApiUrl)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            QR Code Access
          </h1>
          <p className="text-lg text-gray-600">
            Scan the QR code below to quickly access the recreational facility booking form
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* QR Code Display */}
          <Card className="text-center">
            <CardHeader>
              <CardTitle>Booking Form QR Code</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              {qrCodeUrl && (
                <div className="p-4 bg-white rounded-lg shadow-inner">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code for Booking Form" 
                    className="w-64 h-64 mx-auto"
                  />
                </div>
              )}
              <p className="text-sm text-gray-600">
                Scan with your mobile device to access the booking form
              </p>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How to Use QR Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">1</span>
                  <p className="text-gray-700">Open your mobile device's camera or QR code scanner app</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
                  <p className="text-gray-700">Point the camera at the QR code above</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">3</span>
                  <p className="text-gray-700">Tap the notification or link that appears</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">4</span>
                  <p className="text-gray-700">Fill out the booking form on your mobile device</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold text-gray-900 mb-2">Alternative Access Methods:</h4>
                <div className="space-y-2">
                  <Link href="/booking-request">
                    <Button className="w-full">
                      Access Form Directly
                    </Button>
                  </Link>
                  <p className="text-sm text-gray-600 text-center">
                    Or visit the help desk for assistance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Help Desk</h4>
                <p className="text-gray-600 mb-1">For assistance with booking requests</p>
                <p className="text-sm text-gray-500">Email: nrc9.nz.helpdesk@mag-sa.com</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Recreation Department</h4>
                <p className="text-gray-600 mb-1">For event planning and facility information</p>
                <p className="text-sm text-gray-500">Email: nrc9.nz.housing@mag-sa.com</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
