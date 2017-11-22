export const pbParse = input => {
  if (!input) return false
  if (
    input.match(/(Home And Away)|(Judge Judy)|(Coronation Street)|(Emmerdale)/)
  )
    return false
  const e =
    input.match(/S\d\dE\d\d/) ||
    input.match(/\d{4} \d{2} \d{2}/) ||
    input.match(/Series \d \d{1,2}of\d{1,2}/)
  const episode = e ? e.toString() : ''
  const q = input.match(/1080p/) || input.match(/720p/)
  const size =
    input.match(/Size (.*?), ULed/) &&
    input.match(/Size (.*?), ULed/).length > 1 &&
    input
      .match(/Size (.*?), ULed/)[1]
      .replace('MiB', 'MB')
      .replace('GiB', 'GB')
  const quality = q ? q.toString() : 'HDTV'
  const year =
    input.match(/2015/) ||
    input.match(/2016/) ||
    input.match(/2017/) ||
    input.match(/2018/)
  const yearIndex = input.indexOf(year)
  const episodeIndex = input.indexOf(episode)
  const uploadedIndex = input.indexOf('Uploaded')
  const sizeIndex = input.indexOf(' Size')
  const endOfTitleIndex = uploadedIndex
  const title =
    input
      .slice(0, endOfTitleIndex - 1)
      .replace(/\./g, ' ')
      .replace(/\n/g, '')
      .replace(/\t/g, '') +
    ' ' +
    size
  const name = input
    .slice(0, yearIndex - 1)
    .replace(/\./g, ' ')
    .replace(/\n/g, '')
    .replace(/\t/g, '')
    .trim()

  const uploadedAt = input
    .slice(uploadedIndex + 9, sizeIndex - 1)
    .replace(/\./g, ' ')
    .replace(/\n/g, '')
    .replace(/\t/g, '')
  return {
    episode,
    quality,
    size,
    title,
    name,
    year,
    uploadedAt,
  }
}
