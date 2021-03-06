import { Post } from 'imports/http.js'

export function queryTable (options) {
  return Post({
    url: '/statistics/substandard/search',
    data: options,
    onDownloadProgress (progressEvent) {
      const percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total) / 100
      NProgress.set(percentCompleted)
    }
  })
}
