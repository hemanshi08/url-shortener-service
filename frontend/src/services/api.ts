import axios from 'axios'
import type { IUrl, IUrlHistory, AnalyticsData, CreateUrlResponse } from '../types'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const urlService = {
  // Create a short URL
  createShortUrl: async (longUrl: string): Promise<CreateUrlResponse> => {
    const response = await api.post('/create', { longUrl })
    return response.data
  },

  // Get all URLs
  getAllUrls: async (): Promise<IUrl[]> => {
    const response = await api.get('/urls')
    return response.data
  },

  // Get URL analytics
  getUrlAnalytics: async (shortId: string): Promise<AnalyticsData> => {
    const response = await api.get(`/analytics/${shortId}`)
    return response.data
  },

  // Get URL history
  getUrlHistory: async (shortId: string): Promise<IUrlHistory[]> => {
    const response = await api.get(`/history/${shortId}`)
    return response.data
  },

  // Delete a URL
  deleteUrl: async (shortId: string): Promise<void> => {
    await api.delete(`/delete/${shortId}`)
  },
}
