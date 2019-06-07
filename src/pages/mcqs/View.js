import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit.js'
import { DraftViewer } from 'draft/index.js'
import { get, isUndefined, sortBy } from 'lodash-es'
import React, { useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Grid, Header, Icon, Label, Segment } from 'semantic-ui-react'
import { getMCQ, readMCQAnswer } from 'store/actions/mcqs.js'
import { emptyArray } from 'utils/defaults'

const optionLetters = ['a', 'b', 'c', 'd']

function MCQView({ mcqId, mcq, getMCQ, answerId, readMCQAnswer, mcqTags }) {
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
            <Permit teacher>
              <Button as={Link} to={`edit`}>
                Edit
              </Button>
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
        <Header size="small">Tags</Header>
        <Label.Group size="tiny" style={{ marginTop: '1em' }}>
          {get(mcq, 'tagIds', emptyArray).map(id => (
            <Label key={id}>{get(mcqTags.byId, [id, 'name'])}</Label>
          ))}
        </Label.Group>
      </Segment>
    </Segment>
  )
}

const mapStateToProps = ({ mcqs, mcqTags }, { mcqId }) => ({
  mcq: get(mcqs.byId, mcqId),
  answerId: get(mcqs.answerById, mcqId),
  mcqTags
})

const mapDispatchToProps = {
  getMCQ,
  readMCQAnswer
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MCQView)
