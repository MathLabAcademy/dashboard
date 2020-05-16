import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllWebNotifications } from './index'

export function useWebNotification(notificationId) {
  return useSelector((state) => state.notifications.web.byId[notificationId])
}

export function useWebNotifications() {
  const webNotifications = useSelector((state) => state.notifications.web)

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getAllWebNotifications())
  }, [dispatch])

  return webNotifications
}
