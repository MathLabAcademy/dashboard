import api from 'utils/api'

export const COMMENT_ADD = 'COMMENT_ADD'
export const COMMENT_BULK_ADD = 'COMMENT_BULK_ADD'

export const createCommentForCourseVideo = (
  courseId,
  courseVideoId,
  { type, text, parentId }
) => async (dispatch) => {
  const { data, error } = await api(
    `/courses/${courseId}/videos/${courseVideoId}/comments`,
    {
      method: 'POST',
      body: { type, text, parentId },
    }
  )

  if (error) throw error

  dispatch({ type: COMMENT_ADD, data })

  return data
}

export const getAllCommentsForCourseVideo = (courseId, courseVideoId) => async (
  dispatch
) => {
  const { data: _data, error } = await api(
    `/courses/${courseId}/videos/${courseVideoId}/comments`,
    {
      method: 'GET',
    }
  )

  if (error) throw error

  const data = {
    items: _data.items.map((item) => {
      if (item.Children) {
        item.childIds = item.Children.map(({ id }) => id)
        delete item.Children
      }
      return item
    }),
  }

  dispatch({ type: COMMENT_BULK_ADD, data })

  return data
}
