import moment from 'moment'

export const pbParse = input => {
  if (!input) return false
  const size =
    input.match(/Size (.*?), ULed/) &&
    input.match(/Size (.*?), ULed/).length > 1 &&
    input
      .match(/Size (.*?), ULed/)[1]
      .replace('MiB', 'MB')
      .replace('GiB', 'GB')

  const r =
    input.match(/HDRip/i) ||
    input.match(/BRRip/i) ||
    input.match(/DVDRip/i) ||
    input.match(/DVDScr/i) ||
    input.match(/HDCAM/i) ||
    input.match(/HD-TS/i) ||
    input.match(/TSRip/i) ||
    input.match(/WED-DL/i)
  const quality = r ? r.toString() : 'N/A'
  const qualityIndex = input.indexOf(quality)

  const uploadedIndex = input.indexOf('Uploaded')
  const sizeIndex = input.indexOf(' Size')
  const endOfTitleIndex = uploadedIndex
  const y =
    input.match(/2015/) ||
    input.match(/2016/) ||
    input.match(/2017/) ||
    input.match(/2018/)
  const year = y ? y.toString() : new Date().getFullYear().toString()
  const yearIndex = input.slice(0, endOfTitleIndex - 1).indexOf(year)

  const title = input
    .slice(0, endOfTitleIndex - 1)
    .replace(/\./g, ' ')
    .replace(/\n/g, '')
    .replace(/\t/g, '')
    .trim()

  const endOfMovieTitle = yearIndex > 0 ? yearIndex : qualityIndex
  const movieTitle = input
    .slice(0, endOfMovieTitle - 1)
    .replace(/\./g, ' ')
    .replace(/\n/g, '')
    .replace(/\t/g, '')
    .trim()

  const full = input
    .replace(/\./g, ' ')
    .replace(/\n/g, '')
    .replace(/\t/g, '')
    .trim()

  const uploadedAtTime = input
    .slice(uploadedIndex + 9, sizeIndex - 1)
    .replace(/\./g, ' ')
    .replace(/\n/g, '')
    .replace(/\t/g, '')
  const uploadedAt = parseLooseDate(uploadedAtTime).toISOString()

  return {
    quality,
    size,
    title,
    movieTitle,
    year,
    uploadedAt,
    full,
  }
}

const parseLooseDate = uploadedAt => {
  let timeSinceRelease
  if (uploadedAt.includes('Today')) timeSinceRelease = moment()
  else if (uploadedAt.includes('Y-day'))
    timeSinceRelease = moment().subtract(1, 'day')
  else if (uploadedAt.includes(':'))
    timeSinceRelease = moment(uploadedAt, 'MM-DD HH:SS')
  else timeSinceRelease = moment(uploadedAt, 'MM-DD YYYY')
  return timeSinceRelease
}
