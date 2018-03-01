import { pbParse } from '../parsers'

const example =
  '\n\t\t\tSonu Ke Titu Ki Sweety (2018) Hindi 720p DVDRip PRE x264 AAC \n\n\t\t\tUploaded 11-20 04:08, Size 284.93 MiB, ULed by  makintos13 \n\t\t'
const example2 =
  '\n\t\t\tRade Blunner 2049.HDRip.XviD.AC3-EVO\n\n\t\t\tUploaded 03-23 2016, Size 3.48 GiB, ULed by  condors369 \n\t\t'
test('should pull size from input', () => {
  expect(pbParse(example).size).toBe('284.93 MB')
})
test('should pull year from input', () => {
  expect(pbParse(example).year).toBe('2018')
})
test('should pull name from input', () => {
  expect(pbParse(example).full).toBe(
    'Sonu Ke Titu Ki Sweety (2018) Hindi 720p DVDRip PRE x264 AAC Uploaded 11-20 04:08, Size 284 93 MiB, ULed by  makintos13',
  )
})
test('should pull title from input', () => {
  expect(pbParse(example).title).toBe(
    'Sonu Ke Titu Ki Sweety (2018) Hindi 720p DVDRip PRE x264 AAC',
  )
})
test('should pull movie title from input', () => {
  expect(pbParse(example).movieTitle).toBe('Sonu Ke Titu Ki Sweety')
})
test('should pull quality from input', () => {
  expect(pbParse(example).quality).toBe('DVDRip')
})
test('should pull quality from input', () => {
  expect(pbParse(example2).quality).toBe('HDRip')
})
test('should pull movieTitle from strange input', () => {
  expect(pbParse(example2).movieTitle).toBe('Rade Blunner 2049')
})

test('should pull upload date from input', () => {
  expect(pbParse(example2).uploadedAt).toBe('2016-03-22T16:00:00.000Z')
})
