export default async (url, params = {}) => {
  let query = Object.entries(params)
    .map(([key, val]) => Array.isArray(val)
      ? `${key}=${val.join(',')}`
      : `${key}=${val}`)
    .join('&')
  try {
    let response = await fetch(`${url}?${query}`)
    return response.json()
  } catch (error) {
    return {
      success: false,
      error,
    }
  }
}
