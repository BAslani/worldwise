export function convertToEmoji(countryCode: string) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(2))
  return String.fromCodePoint(...codePoints)
}
