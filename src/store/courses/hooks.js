import { get, keyBy } from 'lodash-es'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { emptyArray } from 'utils/defaults'
import {
  getAllEnrollments,
  getCourse,
  getCourseVideo,
  readAllCourseVideo,
} from '.'

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

export function useCourseEnrolledUserIds(courseId, onlyActive = false) {
  const [loading, setLoading] = useState(false)

  const enrollments = useSelector((state) => state.enrollments)

  const userIds = useMemo(() => {
    const enrollmentIdPattern = new RegExp(`^${courseId}:.+`)
    const userIds = enrollments.allIds
      .filter((id) => enrollmentIdPattern.test(id))
      .reduce((userIds, enrollmentId) => {
        const enrollment = enrollments.byId[enrollmentId]
        if (!onlyActive || enrollment.active) {
          userIds.push(enrollment.userId)
        }
        return userIds
      }, [])
    return userIds
  }, [courseId, enrollments.allIds, enrollments.byId, onlyActive])

  const dispatch = useDispatch()
  useEffect(() => {
    if (courseId) {
      setLoading(true)
      dispatch(getAllEnrollments(courseId)).finally(() => setLoading(false))
    }
  }, [courseId, dispatch])

  return { data: userIds, loading }
}

export function useCourseVideos(courseId) {
  const videosById = useSelector((state) => state.videos.byId)
  const allIds = useSelector((state) =>
    get(state.courses.videosById, courseId, emptyArray)
  )

  const byId = useMemo(() => {
    return keyBy(
      allIds.map((id) => videosById[id]),
      'id'
    )
  }, [allIds, videosById])

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(readAllCourseVideo(courseId))
  }, [courseId, dispatch])

  return { allIds, byId }
}

export function useCourseVideo(courseId, videoId) {
  const video = useSelector((state) => state.videos.byId[videoId])

  const courseHasVideo = useSelector((state) =>
    get(state.courses.videosById, courseId, emptyArray).includes(videoId)
  )

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getCourseVideo(courseId, videoId))
  }, [courseId, dispatch, videoId])

  return courseHasVideo ? video : null
}
