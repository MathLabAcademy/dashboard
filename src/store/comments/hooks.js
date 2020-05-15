import { get } from 'lodash-es'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { emptyArray } from 'utils/defaults'
import { getAllCommentsForCourseVideo } from './index'

export function useComment(commentId) {
  return useSelector((state) => state.comments.byId[commentId])
}

export function useCourseVideoComments(courseId, videoId, depth = null) {
  const thread = useMemo(() => `courses/${courseId}/videos/${videoId}`, [
    courseId,
    videoId,
  ])

  const commentIds = useSelector((state) =>
    get(state.comments.idsByThread, thread, emptyArray)
  )

  const byId = useSelector((state) => state.comments.byId)

  const allIds = useMemo(() => {
    if (depth === null) return commentIds
    return commentIds.filter((id) => get(byId[id], 'depth') === depth)
  }, [byId, commentIds, depth])

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getAllCommentsForCourseVideo(courseId, videoId))
  }, [courseId, dispatch, videoId])

  return {
    byId,
    allIds,
  }
}
