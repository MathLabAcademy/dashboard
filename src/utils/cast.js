export const toDate = (date) => {
  if (!date) return date
  return date instanceof Date ? date : new Date(date)
}
