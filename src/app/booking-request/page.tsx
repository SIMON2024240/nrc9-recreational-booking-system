"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { BookingService } from "@/lib/booking-service"
import { VENUES, COMPANIES, DESIGNATIONS } from "@/types/booking"
import Link from "next/link"
import { useRouter } from "next/navigation"

const bookingSchema = z.object({
  requesterName: z.string().min(1, "Name is required"),
  requestInitiatedDate: z.string().min(1, "Date is required"),
  companyName: z.string().min(1, "Company name is required"),
  designation: z.string().min(1, "Designation is required"),
  mobileNumber: z.string().min(1, "Mobile number is required"),
  email: z.string().email("Valid email is required"),
  residenceOfNRC9: z.boolean(),
  unitNo: z.string().optional(),
  unitLocation: z.string().optional(),
  venueRequested: z.string().min(1, "Venue is required"),
  event: z.string().min(1, "Event description is required"),
  eventScheduleStartDate: z.string().min(1, "Start date is required"),
  eventEndDate: z.string().min(1, "End date is required"),
  eventStartTime: z.string().min(1, "Start time is required"),
  eventEndTime: z.string().min(1, "End time is required"),
  numberOfGuests: z.number().min(0, "Number of guests must be 0 or more"),
  avSystem: z.boolean(),
  avSystemDetails: z.string().optional(),
  fbServices: z.boolean(),
  fbServicesDetails: z.string().optional(),
  chargeable: z.boolean(),
  chargeableAmount: z.number().optional(),
  invoiceTo: z.string().optional(),
  remarks: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

export default function BookingRequestPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      requesterName: "",
      requestInitiatedDate: new Date().toISOString().split('T')[0], // Use ISO format for date input
      companyName: "",
      designation: "",
      mobileNumber: "",
      email: "",
      residenceOfNRC9: false,
      unitNo: "",
      unitLocation: "",
      venueRequested: "",
      event: "",
      eventScheduleStartDate: "",
      eventEndDate: "",
      eventStartTime: "",
      eventEndTime: "",
      numberOfGuests: 0,
      avSystem: false,
      avSystemDetails: "",
      fbServices: false,
      fbServicesDetails: "",
      chargeable: false,
      chargeableAmount: 0,
      invoiceTo: "",
      remarks: "",
    },
  })

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true)
    try {
      const booking = BookingService.createBooking(data)
      setSubmitSuccess(true)
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(`/track-requests?id=${booking.id}`)
      }, 2000)
    } catch (error) {
      console.error('Error submitting booking:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">✓</span>
            </div>
            <CardTitle className="text-green-600">Request Submitted Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Your recreational facility booking request has been submitted and is pending approval.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to tracking page...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            NEOM Residential Community-09 (NRC9)
          </h1>
          <h2 className="text-xl font-semibold text-gray-700">
            Recreational Facilities Reservation Request Form
          </h2>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Section A: Requester Information */}
            <Card>
              <CardHeader className="bg-orange-400 text-white">
                <CardTitle>Section A: Requester Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="requesterName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="bg-orange-200 px-2 py-1 font-semibold">Name of Requester:</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter full name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requestInitiatedDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="bg-orange-200 px-2 py-1 font-semibold">Request Initiated Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="bg-orange-200 px-2 py-1 font-semibold">Company Name:</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select company" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {COMPANIES.map((company) => (
                              <SelectItem key={company} value={company}>
                                {company}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="designation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="bg-orange-200 px-2 py-1 font-semibold">Designation</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select designation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DESIGNATIONS.map((designation) => (
                              <SelectItem key={designation} value={designation}>
                                {designation}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="bg-orange-200 px-2 py-1 font-semibold">Mobile number:</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter mobile number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="bg-orange-200 px-2 py-1 font-semibold">Email:</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="Enter email address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <FormField
                    control={form.control}
                    name="residenceOfNRC9"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="bg-orange-200 px-2 py-1 font-semibold">
                            Residence of NRC9:
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unitNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="bg-orange-200 px-2 py-1 font-semibold">Unit No</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., FMB-025" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unitLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="bg-orange-200 px-2 py-1 font-semibold">Unit Location</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., FMB-Blk2-Bld1" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Event Details */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="venueRequested"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="bg-orange-200 px-2 py-1 font-semibold text-center block">Venue Requested:</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select venue" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {VENUES.map((venue) => (
                              <SelectItem key={venue} value={venue}>
                                {venue}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="event"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="bg-orange-200 px-2 py-1 font-semibold text-center block">Event:</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter event description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="eventScheduleStartDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bg-orange-200 px-2 py-1 font-semibold text-xs">(Event Schedule) Start Date:</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="eventEndDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bg-orange-200 px-2 py-1 font-semibold text-xs">Event End Date</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="eventStartTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bg-orange-200 px-2 py-1 font-semibold text-xs">Event start Time</FormLabel>
                          <FormControl>
                            <Input {...field} type="time" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="eventEndTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="bg-orange-200 px-2 py-1 font-semibold text-xs">Event End Time</FormLabel>
                          <FormControl>
                            <Input {...field} type="time" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="numberOfGuests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="bg-orange-200 px-2 py-1 font-semibold">No. of Guests:</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            min="0"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="avSystem"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="bg-orange-200 px-2 py-1 font-semibold">
                              A/V System:
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      {form.watch("avSystem") && (
                        <FormField
                          control={form.control}
                          name="avSystemDetails"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea {...field} placeholder="(if yes provide details/RFQ)" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="fbServices"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="bg-orange-200 px-2 py-1 font-semibold">
                              F & B Services
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      {form.watch("fbServices") && (
                        <FormField
                          control={form.control}
                          name="fbServicesDetails"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea {...field} placeholder="(if yes provide details/RFQ)" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="chargeable"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="bg-orange-200 px-2 py-1 font-semibold">
                              Chargeable:
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      {form.watch("chargeable") && (
                        <FormField
                          control={form.control}
                          name="chargeableAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="flex items-center space-x-2">
                                  <span>Amount:</span>
                                  <Input 
                                    {...field} 
                                    type="number" 
                                    min="0"
                                    step="0.01"
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  />
                                  <span>SAR</span>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    {form.watch("chargeable") && (
                      <FormField
                        control={form.control}
                        name="invoiceTo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="bg-orange-200 px-2 py-1 font-semibold">Invoice to:</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter invoice details" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="bg-orange-200 px-2 py-1 font-semibold">Remarks:</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Additional comments or requirements" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submission Instructions */}
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600 mb-4">
                  *Please submit the duly filled request form to{" "}
                  <span className="font-semibold">nrc9.nz.housing@mag-sa.com</span> or{" "}
                  <span className="font-semibold">nrc9.nz.helpdesk@mag-sa.com</span>
                </p>
                <p className="text-sm text-gray-600">
                  For approval queries, contact Soft Service Manager:{" "}
                  <span className="font-semibold">v.athiyodan@mag-sa.com</span>
                </p>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button 
                type="submit" 
                size="lg" 
                disabled={isSubmitting}
                className="px-8 py-3"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  )
}
