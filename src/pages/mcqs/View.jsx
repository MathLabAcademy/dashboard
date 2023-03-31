import { Badge } from '@chakra-ui/core'
import { Link } from '@reach/router'
import { DraftViewer } from 'components/Draft'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { get, isUndefined, sortBy } from 'lodash-es'
import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Flex } from 'reflexbox'
import { Button, Grid, Header, Icon, Label, Segment } from 'semantic-ui-react'
import { getMCQ, readMCQAnswer } from 'store/actions/mcqs'
import { emptyArray } from 'utils/defaults'
import MCQDeleteModal from './ActionModals/Delete'

const optionLetters = ['a', 'b', 'c', 'd']

function MCQView({
  mcqId,
  mcq,
  getMCQ,
  answerId,
  readMCQAnswer,
  mcqTags,
  prevMCQId,
  nextMCQId,
}) {
  useEffect(() => {
    if (!mcq) getMCQ(mcqId)
  }, [getMCQ, mcq, mcqId, readMCQAnswer])

  useEffect(() => {
    if (isUndefined(answerId)) readMCQAnswer(mcqId)
  }, [answerId, mcqId, readMCQAnswer])

  const options = useMemo(() => {
    return sortBy(get(mcq, 'Options'), 'id')
  }, [mcq])

  if (!mcq) return null

  return (
    <>
      <Flex justifyContent="space-between" mb={3}>
        <Button disabled={!prevMCQId} as={Link} to={`../${prevMCQId}`}>
          Previous
        </Button>

        <Button disabled={!nextMCQId} as={Link} to={`../${nextMCQId}`}>
          Next
        </Button>
      </Flex>

      <Segment>
        <HeaderGrid
          Left={
            <Header>
              <Header.Subheader>ID: #{mcqId}</Header.Subheader>
              <DraftViewer rawValue={mcq.text} />
            </Header>
          }
          Right={
            <>
              {!answerId && <Label color="yellow" content={`need answer`} />}
              <Button as={Link} to={`..`}>
                Go Back
              </Button>
              <Permit roles="teacher,assistant">
                <Button as={Link} to={`edit`}>
                  Edit
                </Button>
                {mcq.deleted ? (
                  <Badge variantColor="red" fontSize={4} p={2}>
                    Deleted!
                  </Badge>
                ) : (
                  <MCQDeleteModal mcqId={mcqId} />
                )}
              </Permit>
            </>
          }
        />

        <Segment basic>
          <Grid columns={1}>
            {options.map((option, index) => (
              <Grid.Column key={option.id}>
                {optionLetters[index]}.{' '}
                <DraftViewer rawValue={option.text} inline />{' '}
                {option.id === answerId && <Icon name="check" color="green" />}
              </Grid.Column>
            ))}
          </Grid>
        </Segment>

        <Segment basic>
          <Header size="small">Guide</Header>
          <DraftViewer rawValue={mcq.guide} />
        </Segment>

        <Segment basic>
          <Header size="small">Tags</Header>
          <Label.Group size="tiny" style={{ marginTop: '1em' }}>
            {get(mcq, 'tagIds', emptyArray).map((id) => (
              <Label key={id}>{get(mcqTags.byId, [id, 'name'])}</Label>
            ))}
          </Label.Group>
        </Segment>
      </Segment>

      <Flex justifyContent="space-between" mt={3}>
        <Button disabled={!prevMCQId} as={Link} to={`../${prevMCQId}`}>
          Previous
        </Button>

        <Button disabled={!nextMCQId} as={Link} to={`../${nextMCQId}`}>
          Next
        </Button>
      </Flex>
    </>
  )
}

const mapStateToProps = ({ mcqs, mcqTags }, { mcqId }) => {
  const index = mcqs.allIds.indexOf(+mcqId)
  const prevMCQId = mcqs.allIds[index - 1]
  const nextMCQId = mcqs.allIds[index + 1]

  return {
    mcq: get(mcqs.byId, mcqId),
    answerId: get(mcqs.answerById, mcqId),
    mcqTags,
    prevMCQId,
    nextMCQId,
  }
}

const mapDispatchToProps = {
  getMCQ,
  readMCQAnswer,
}
export default connect(mapStateToProps, mapDispatchToProps)(MCQView)
