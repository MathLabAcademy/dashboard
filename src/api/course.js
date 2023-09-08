import api from 'utils/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

async function getCourseAttendances(courseId, date) {
  const { data, error } = await api(`/courses/${courseId}/attendances/${date}`)
  if (error) {
    throw error
  }

  return data
}

async function updateCourseAttendances(courseId, date, items) {
  const { data, error } = await api(
    `/courses/${courseId}/attendances/${date}`,
    { method: 'PUT', body: { items } }
  )
  if (error) {
    throw error
  }

  return data
}

export function useCourseAttendances(courseId, date) {
  return useQuery({
    queryKey: ['courses', courseId, 'attendances', date],
    queryFn: ({ queryKey }) => {
      getCourseAttendances(queryKey[1], queryKey[3])
    },
  })
}

export function useCourseAttendancesMutation(courseId, date) {
  const queryClient = useQueryClient()

  const updateAttendances = useMutation({
    mutationFn: (items) => {
      return updateCourseAttendances(courseId, date, items)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['courses', courseId, 'attendances', date],
        refetchType: 'inactive',
      })
    },
  })

  return {
    updateAttendances,
  }
}
