import moment from 'moment'
export const isExpired = key => {
  const expire = localStorage.getItem(key + '.lastScrape')
  const value = localStorage.getItem(key)
  if (!expire || !value) return true
  console.log(key + ' has Expired', moment().isAfter(expire))
  return moment().isAfter(expire)
}
export const setExpiry = (key, value) => {
  localStorage.setItem(
    key + '.lastScrape',
    moment()
      .add(1, 'hour')
      .format(),
  )
  localStorage.setItem(key, JSON.stringify(value))
}
