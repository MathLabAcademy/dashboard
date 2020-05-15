import { useSelector } from 'react-redux'

export function useVideo(videoId) {
  const video = useSelector((state) => state.videos.byId[videoId])
  return video
}
