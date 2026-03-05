export interface IUrl {
  _id: string
  shortId: string
  longUrl: string
  totalClicks: number
  createdAt: string
  updatedAt: string
}

export interface IUrlHistory {
  _id: string
  urlId: string
  shortId: string
  ipAddress: string
  userAgent: string
  os: string
  browser: string
  device: string
  createdAt: string
}

export interface AnalyticsData {
  totalClicks: number
  uniqueVisitors: number
  topBrowser: { name: string; count: number }
  topOS: { name: string; count: number }
  clickData: { date: string; clicks: number }[]
  browserDistribution: { name: string; value: number }[]
  deviceDistribution: { name: string; value: number }[]
}

export interface CreateUrlResponse {
  shortId: string
  longUrl: string
  shortUrl: string
}
