import api from 'utils/api'

export const COMMENT_ADD = 'COMMENT_ADD'
export const COMMENT_BULK_ADD = 'COMMENT_BULK_ADD'

export const COMMENT_SUBSCRIBE = 'COMMENT_SUBSCRIBE'
export const COMMENT_UNSUBSCRIBE = 'COMMENT_UNSUBSCRIBE'

export const subscribeToComment = (commentId) => async (dispatch) => {
  const { error } = await api(`/user/comments/${commentId}/action/subscribe`, {
    method: 'POST',
  })

  if (error) throw error

  dispatch({ type: COMMENT_SUBSCRIBE, commentId })
}

export const unsubscribeFromComment = (commentId) => async (dispatch) => {
  const { error } = await api(
    `/user/comments/${commentId}/action/unsubscribe`,
    {
      method: 'POST',
    }
  )

  if (error) throw error

  dispatch({ type: COMMENT_UNSUBSCRIBE, commentId })
}

export const createCommentForCourseVideo = (
  courseId,
  videoId,
  { type, text, parentId }
) => async (dispatch) => {
  const { data, error } = await api(
    `/courses/${courseId}/videos/${videoId}/comments`,
    {
      method: 'POST',
      body: { type, text, parentId },
    }
  )

  if (error) throw error

  dispatch({ type: COMMENT_ADD, data })

  return data
}

export const getAllCommentsForCourseVideo = (courseId, videoId) => async (
  dispatch
) => {
  const { data: _data, error } = await api(
    `/courses/${courseId}/videos/${videoId}/comments`,
    {
      method: 'GET',
    }
  )

  if (error) throw error

  const data = {
    items: _data.items.map((item) => {
      if (item.children) {
        item.childIds = item.children.map(({ id }) => id)
        delete item.children
      }
      return item
    }),
  }

  dispatch({ type: COMMENT_BULK_ADD, data })

  return data
}
