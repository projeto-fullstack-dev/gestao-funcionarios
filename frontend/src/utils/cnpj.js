export const onlyCnpjDigits = (value = '') => String(value).replace(/\D/g, '').slice(0, 14)

export function maskCnpj(value = '') {
  return onlyCnpjDigits(value).replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\/\d{4})(\d)/, '$1-$2')
}

function digit(base, weights) {
  const sum = base.split('').reduce((total, number, index) => total + Number(number) * weights[index], 0)
  const remainder = sum % 11
  return remainder < 2 ? 0 : 11 - remainder
}

export function isValidCnpj(value) {
  const numbers = onlyCnpjDigits(value)
  if (numbers.length !== 14 || /^(\d)\1{13}$/.test(numbers)) return false
  const first = digit(numbers.slice(0, 12), [5,4,3,2,9,8,7,6,5,4,3,2])
  const second = digit(`${numbers.slice(0, 12)}${first}`, [6,5,4,3,2,9,8,7,6,5,4,3,2])
  return numbers.endsWith(`${first}${second}`)
}
