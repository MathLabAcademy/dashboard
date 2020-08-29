import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCQExam } from 'store/cqExams'
import useSWR from 'swr'
import api from 'utils/api'

export function useCQExam(cqExamId) {
  const cqExam = useSelector((state) => state.cqExams.byId[cqExamId])

  const dispatch = useDispatch()

  useEffect(() => {
    if (!cqExam) {
      dispatch(getCQExam(cqExamId))
    }
  }, [cqExam, cqExamId, dispatch])

  return cqExam
}

const fetcher = async (key) => {
  const { data, error } = await api(key)
  if (error) throw error
  return data
}
export function useCQExamSubmissionsForUser(cqExamId, userId) {
  const swr = useSWR(`/cqexams/${cqExamId}/submissions/${userId}`, fetcher)

  return swr
}

export function useCQExamStudents(cqExamId) {
  const swr = useSWR(`/cqexams/${cqExamId}/submissions/students`, fetcher)

  return swr
}
