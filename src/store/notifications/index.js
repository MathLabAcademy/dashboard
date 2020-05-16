import api from 'utils/api'

export const NOTIFICATION_WEB_ADD = 'NOTIFICATION_WEB_ADD'
export const NOTIFICATION_WEB_BULK_ADD = 'NOTIFICATION_WEB_BULK_ADD'
export const NOTIFICATION_WEB_UPDATE = 'NOTIFICATION_WEB_UPDATE'

export const getAllWebNotifications = () => async (dispatch) => {
  const { data, error } = await api(`/user/notifications/web/unread`, {
    method: 'GET',
  })

  if (error) throw error

  dispatch({ type: NOTIFICATION_WEB_BULK_ADD, data })

  return data
}

export const markWebNotificationAsRead = (notificationId) => async (
  dispatch
) => {
  const { data, error } = await api(
    `/user/notifications/web/${notificationId}/action/mark-read`,
    {
      method: 'POST',
    }
  )

  if (error) throw error

  dispatch({ type: NOTIFICATION_WEB_UPDATE, notificationId, data })

  return data
}
