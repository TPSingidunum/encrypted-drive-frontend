import axios, { type AxiosResponse } from 'axios'
import { ApiError } from '@/types/ApiError'
import type { FailedRequest } from '@/types/FailedRequest'

const baseURL = import.meta.env.VITE_BACKEND_URL
let isRefreshing = false
let failedQueue: FailedRequest[] = []

export async function makeRequest<T>(requestFunc: () => Promise<AxiosResponse<T>>): Promise<T> {
  try {
    const response = await requestFunc()
    return response.data
  } catch (error: any) {
    if (error.response && error.response.data) {
      const { statusCode, errorCode, message } = error.response.data
      throw new ApiError(statusCode, errorCode, message)
    } else {
      console.log(JSON.stringify(error, null, 2))
      throw new Error('Network error or unexpected error occurred')
    }
  }
}

const apiClient = axios.create({
  baseURL,
})

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token") // Assuming tokens are stored in localStorage
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token
            return apiClient(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem(`${tokenPrefix}_refresh_token`)
      try {
        const { data } = await axios.post(`${baseURL}/api/auth/refresh`, {
          refreshToken: refreshToken,
        })

        localStorage.setItem(`${tokenPrefix}_access_token`, data.accessToken)
        apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token
        originalRequest.headers['Authorization'] = 'Bearer ' + data.access_token
        processQueue(null, data.access_token)
        return apiClient(originalRequest)
      } catch (err) {
        processQueue(err, null)
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient
