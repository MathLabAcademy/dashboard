import api from 'utils/api'

export const COMMENT_ADD = 'COMMENT_ADD'
export const COMMENT_BULK_ADD = 'COMMENT_BULK_ADD'

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
