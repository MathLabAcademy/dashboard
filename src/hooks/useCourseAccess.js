import { get } from 'lodash-es'
import { useSelector } from 'react-redux'
import { useCurrentUserData } from 'store/currentUser/hooks'

export function useCourseAccess(courseId) {
  const currentUser = useCurrentUserData()
  const isEnrolled = useSelector((state) =>
    get(state.enrollments.byId[`${courseId}:${currentUser.id}`], 'active')
  )
  return ['teacher', 'analyst', 'assistant'].includes(currentUser.roleId) || isEnrolled
}
