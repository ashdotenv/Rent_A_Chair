"use client"

import { useState, useEffect } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, User, Mail, Lock, Phone, MapPin } from "lucide-react"
import { useRegisterMutation } from "@/redux/features/api/apiSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { loginSuccess, selectError, clearError } from "@/redux/features/auth/authSlice"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import AuthGuard from "@/components/auth-guard"
import { CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

const validationSchema = Yup.object({
  fullName: Yup.string()
    .min(2, "Full name must be at least 2 characters")
    .max(50, "Full name must be less than 50 characters")
    .required("Full name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number")
    .required("Password is required"),
  phone: Yup.string()
    .matches(/^[0-9+\-\s()]+$/, "Invalid phone number")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
  address: Yup.string()
    .min(10, "Address must be at least 10 characters")
    .required("Address is required"),
})

const initialValues = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  address: "",
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const error = useAppSelector(selectError)
  
  const [register, { isLoading }] = useRegisterMutation()

  // Clear error on component mount
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: any) => {
    try {
      const result = await register(values).unwrap()

      // Check if registration was successful
      if (result.success && result.user && result.token) {
        // Show success toast
        toast.success("Registration successful!", {
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
        })

        // Dispatch login success action (auto-login after registration)
        dispatch(loginSuccess({
          user: result.user,
          token: result.token
        }))

        // Reset form
        resetForm()

        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        // Show error message from API
        toast.error(result.message || "Registration failed", {
          icon: <XCircle className="w-5 h-5 text-red-600" />,
        })
      }
    } catch (error: any) {
      console.error("Registration error:", error)

      // Handle different types of errors
      if (error?.data?.message) {
        toast.error(error.data.message, {
          icon: <XCircle className="w-5 h-5 text-red-600" />,
        })
      } else if (error?.error) {
        toast.error(error.error, {
          icon: <XCircle className="w-5 h-5 text-red-600" />,
        })
      } else {
        toast.error("Registration failed. Please try again.", {
          icon: <XCircle className="w-5 h-5 text-red-600" />,
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-[#1980E5] rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-black">Create Account</CardTitle>
            <CardDescription className="text-black">
              Join us and start your journey today
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isValid, dirty }: any) => (
                <Form className="space-y-4">
                  {/* Full Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium text-black">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Field
                        as={Input}
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        className={`pl-10 border-gray-300 focus:border-[#1980E5] focus:ring-[#1980E5] text-black placeholder-gray-500 ${errors.fullName && touched.fullName ? "border-red-500" : ""
                          }`}
                      />
                    </div>
                    <ErrorMessage name="fullName" component="div" className="text-red-500 text-sm" />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-black">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className={`pl-10 border-gray-300 focus:border-[#1980E5] focus:ring-[#1980E5] text-black placeholder-gray-500 ${errors.email && touched.email ? "border-red-500" : ""
                          }`}
                      />
                    </div>
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-black">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className={`pl-10 pr-10 border-gray-300 focus:border-[#1980E5] focus:ring-[#1980E5] text-black placeholder-gray-500 ${errors.password && touched.password ? "border-red-500" : ""
                          }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-black">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Field
                        as={Input}
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        className={`pl-10 border-gray-300 focus:border-[#1980E5] focus:ring-[#1980E5] text-black placeholder-gray-500 ${errors.phone && touched.phone ? "border-red-500" : ""
                          }`}
                      />
                    </div>
                    <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                  </div>

                  {/* Address Field */}
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-black">
                      Address
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Field
                        as="textarea"
                        id="address"
                        name="address"
                        placeholder="Enter your address"
                        rows={3}
                        className={`w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:border-[#1980E5] focus:ring-1 focus:ring-[#1980E5] resize-none text-black placeholder-gray-500 ${errors.address && touched.address ? "border-red-500" : ""
                          }`}
                      />
                    </div>
                    <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={!isValid || !dirty || isLoading}
                    className="w-full bg-[#1980E5] hover:bg-[#1565C0] text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>

                  {/* Login Link */}
                  <div className="text-center text-sm text-black">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#1980E5] hover:underline font-medium">
                      Sign in here
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
} 