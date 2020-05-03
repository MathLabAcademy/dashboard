import { get } from 'lodash-es'
import { useSelector } from 'react-redux'
import { useCurrentUserData } from 'store/currentUser/hooks'

export function useCourseEnrollment(courseId) {
  const currentUser = useCurrentUserData()
  const isEnrolled = useSelector((state) =>
    get(state.enrollments.byId[`${courseId}:${currentUser.id}`], 'active')
  )
  return isEnrolled
}
