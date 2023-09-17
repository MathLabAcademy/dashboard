import { get } from 'lodash-es'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMCQ, readMCQAnswer } from 'store/actions/mcqs'

export function useMCQ(mcqId) {
  const mcq = useSelector((state) => get(state.mcqs.byId, mcqId, null))

  const dispatch = useDispatch()
  useEffect(() => {
    if (mcqId && mcq === null) {
      dispatch(getMCQ(mcqId))
    }
  }, [dispatch, mcq, mcqId])

  return mcq
}

export function useNeighborMCQIds(mcqId) {
  const mcqs = useSelector((state) => state.mcqs)

  const index = mcqs.allIds.indexOf(+mcqId)
  const prevMCQId = mcqs.allIds[index - 1]
  const nextMCQId = mcqs.allIds[index + 1]

  return {
    prevMCQId,
    nextMCQId,
  }
}

export function useMCQAnswerId(mcqId) {
  const answerId = useSelector((state) =>
    get(state.mcqs.answerById, mcqId, null)
  )

  const dispatch = useDispatch()
  useEffect(() => {
    if (mcqId && answerId === null) {
      dispatch(readMCQAnswer(mcqId))
    }
  }, [answerId, dispatch, mcqId])

  return answerId
}
