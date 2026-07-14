export function onlyCpfDigits(value = '') {
  return String(value).replace(/\D/g, '').slice(0, 11)
}

export function maskCpf(value = '') {
  const digits = onlyCpfDigits(value)

  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2')
}

function calculateDigit(base) {
  const sum = base.split('').reduce(
    (total, digit, index) => total + Number(digit) * (base.length + 1 - index),
    0,
  )
  const remainder = (sum * 10) % 11
  return remainder === 10 ? 0 : remainder
}

export function isValidCpf(value) {
  const digits = onlyCpfDigits(value)
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false

  const firstDigit = calculateDigit(digits.slice(0, 9))
  const secondDigit = calculateDigit(`${digits.slice(0, 9)}${firstDigit}`)

  return digits.endsWith(`${firstDigit}${secondDigit}`)
}
