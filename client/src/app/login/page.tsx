"use client"

import { useState, useEffect } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useLoginMutation } from "@/redux/features/api/apiSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { loginSuccess, selectError, clearError } from "@/redux/features/auth/authSlice"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import AuthGuard from "@/components/auth-guard"
import { CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required"),
})

const initialValues = {
  email: "",
  password: "",
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const error = useAppSelector(selectError)
  
  const [login, { isLoading }] = useLoginMutation()

  // Clear error on component mount
  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: any) => {
    try {
      const result = await login(values).unwrap()
      
      // Check if login was successful
      if (result.success && result.user && result.token) {
        // Show success toast
        toast.success("Login successful!", {
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
        })
        
        // Dispatch login success action
        dispatch(loginSuccess({
          user: result.user,
          token: result.token
        }))
        
        // Reset form
        resetForm()
        
        // Redirect to dashboard or home page
        router.push('/dashboard')
      } else {
        // Show error message from API
        toast.error(result.message || "Login failed", {
          icon: <XCircle className="w-5 h-5 text-red-600" />,
        })
      }
    } catch (error: any) {
      console.error("Login error:", error)
      
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
        toast.error("Login failed. Please try again.", {
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
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-black">Welcome Back</CardTitle>
            <CardDescription className="text-black">
              Sign in to your account to continue
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
                        className={`pl-10 border-gray-300 focus:border-[#1980E5] focus:ring-[#1980E5] text-black placeholder-gray-500 ${
                          errors.email && touched.email ? "border-red-500" : ""
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
                        className={`pl-10 pr-10 border-gray-300 focus:border-[#1980E5] focus:ring-[#1980E5] text-black placeholder-gray-500 ${
                          errors.password && touched.password ? "border-red-500" : ""
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

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <Link href="/forgot-password" className="text-sm text-[#1980E5] hover:underline font-medium">
                      Forgot your password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={!isValid || !dirty || isLoading}
                    className="w-full bg-[#1980E5] hover:bg-[#1565C0] text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>

                  {/* Register Link */}
                  <div className="text-center text-sm text-black">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-[#1980E5] hover:underline font-medium">
                      Sign up here
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