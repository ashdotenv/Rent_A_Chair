import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define the user interface
export interface User {
  id: string
  fullName: string
  email: string
  password: string
  phone: string
  address: string
  role: string
  loyaltyPoints: number
  referralCode: string
  referredById: string | null
  createdAt: string
  updatedAt: string
}

// Define the auth state interface
export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Get initial state from localStorage if available
const getInitialState = (): AuthState => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (token && user) {
      try {
        return {
          user: JSON.parse(user),
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }
      } catch (error) {
        // If parsing fails, clear localStorage and return default state
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  }
}

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
    },

    // Login success
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      }
    },

    // Logout
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null

      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },

    // Update user profile
    updateProfile: (state, action: PayloadAction<User>) => {
      state.user = action.payload

      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload))
      }
    },

    // Clear error
    clearError: (state) => {
      state.error = null
    },
  },
})

// Export actions
export const {
  setLoading,
  setError,
  loginSuccess,
  logout,
  updateProfile,
  clearError,
} = authSlice.actions

// Export selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth
export const selectUser = (state: { auth: AuthState }) => state.auth.user
export const selectToken = (state: { auth: AuthState }) => state.auth.token
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading
export const selectError = (state: { auth: AuthState }) => state.auth.error

// Export reducer
export default authSlice.reducer 