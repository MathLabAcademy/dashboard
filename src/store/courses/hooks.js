import { get, keyBy } from 'lodash-es'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { emptyArray } from 'utils/defaults'
import { readAllCourseVideo } from '.'

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
  const data = useMemo(() => {
    const [, videoProvider, videoId] = courseVideoId.split(':')
    return { id: courseVideoId, courseId, videoProvider, videoId }
  }, [courseId, courseVideoId])

  return data
}
