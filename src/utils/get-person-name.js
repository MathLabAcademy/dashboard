const getPersonName = person => {
  if (!person) return ``

  const { firstName, middleName, lastName } = person

  return `${firstName}${middleName ? ` ${middleName} ` : ' '}${lastName}`
}

export default getPersonName
