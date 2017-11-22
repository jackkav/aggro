import { pbParse } from '../parsers'

const example =
  '\n\t\t\tThe.Stalking.Lead.S08E05.HDTV.x264-SVA\n\n\t\t\tUploaded 11-20 04:08, Size 284.93 MiB, ULed by  makintos13 \n\t\t'
const example2 =
  '\n\t\t\tJar.Wars.Episode.I.2015.1080p.BluRay-JYK\n\n\t\t\tUploaded 03-23 2016, Size 3.48 GiB, ULed by  condors369 \n\t\t'
test('should pull size from input', () => {
  expect(pbParse(example).size).toBe('284.93 MB')
})
test('should pull name from input', () => {
  expect(pbParse(example).name).toBe(
    'The Stalking Lead S08E05 HDTV x264-SVAUploaded 11-20 04:08, Size 284 93 MiB, ULed by  makintos13',
  )
})
test('should pull title from input', () => {
  expect(pbParse(example).title).toBe(
    'The Stalking Lead S08E05 HDTV x264-SVA 284.93 MB',
  )
})
test('should pull quality from input', () => {
  expect(pbParse(example2).quality).toBe('1080p')
})

test('should pull upload date from input', () => {
  expect(pbParse(example2).uploadedAt).toBe('03-23 2016')
})
