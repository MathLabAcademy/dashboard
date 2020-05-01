import { get, keyBy } from 'lodash-es'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { emptyArray } from 'utils/defaults'
import { getAllEnrollments, getCourse, readAllCourseVideo } from '.'

export function useCourse(courseId) {
  const course = useSelector((state) => get(state.courses.byId, courseId, null))

  const dispatch = useDispatch()
  useEffect(() => {
    if (courseId && course === null) {
      dispatch(getCourse(courseId))
    }
  }, [course, courseId, dispatch])

  return course
}

export function useCourseEnrolledUserIds(courseId) {
  const userIds = useSelector((state) =>
    get(state.courses.enrollmentsById, courseId, emptyArray)
  )

  const dispatch = useDispatch()
  useEffect(() => {
    if (courseId && userIds === emptyArray) {
      dispatch(getAllEnrollments(courseId))
    }
  }, [courseId, dispatch, userIds])

  return userIds
}

export function useCourseVideos(courseId) {
  const allIds = useSelector((state) =>
    get(state.courses.videosById, courseId, emptyArray)
  )

  const byId = useMemo(() => {
    return keyBy(
      allIds.map((id) => {
        const [courseId, videoProvider, videoId] = id.split(':')
        return { id, courseId, videoProvider, videoId }
      }),
      'id'
    )
  }, [allIds])

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(readAllCourseVideo(courseId))
  }, [courseId, dispatch])

  return { allIds, byId }
}

export function useCourseVideo(courseId, courseVideoId) {
  const courseHasVideo = useSelector((state) =>
    get(state.courses.videosById, courseId, emptyArray).includes(courseVideoId)
  )

  const data = useMemo(() => {
    if (!courseHasVideo) {
      return {}
    }

    const [, videoProvider, videoId] = courseVideoId.split(':')
    return { id: courseVideoId, courseId, videoProvider, videoId }
  }, [courseHasVideo, courseId, courseVideoId])

  return data
}
