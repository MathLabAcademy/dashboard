import { get } from 'lodash-es'
import { useSelector } from 'react-redux'
import { useCurrentUser } from 'store/currentUser/hooks'

export function useCourseEnrollment(courseId) {
  const user = useCurrentUser()
  const isEnrolled = useSelector((state) =>
    get(state.enrollments.byId[`${courseId}:${user.id}`], 'active')
  )
  return isEnrolled
}
