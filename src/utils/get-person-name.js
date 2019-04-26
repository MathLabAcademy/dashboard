const getPersonName = ({
  firstName = '',
  middleName = '',
  lastName = ''
} = {}) => {
  return `${firstName}${middleName ? ` ${middleName} ` : ' '}${lastName}`
}

export default getPersonName
