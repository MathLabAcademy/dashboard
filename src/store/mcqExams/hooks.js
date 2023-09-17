import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMCQExam } from 'store/actions/mcqExams'

export function useMCQExam(mcqExamId) {
  const mcqExam = useSelector((state) => state.mcqExams.byId[mcqExamId])

  const dispatch = useDispatch()
  useEffect(() => {
    if (!mcqExam) {
      dispatch(getMCQExam(mcqExamId))
    }
  }, [mcqExam, mcqExamId, dispatch])

  return mcqExam
}
