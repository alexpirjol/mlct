// Format phone number with proper spacing
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '')

  // Romanian mobile format: 07XX XXX XXX (4-3-3)
  if (digits.startsWith('07') && digits.length === 10) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`
  }

  // Romanian landline format: 0XX XXX XXXX (3-3-4)
  if (digits.startsWith('0') && digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
  }

  // International format with + : +XX XXX XXX XXX
  if (phone.startsWith('+')) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`
  }

  // Default: return as-is if format doesn't match
  return phone
}
