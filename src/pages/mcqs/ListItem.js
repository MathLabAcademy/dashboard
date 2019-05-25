import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit.js'
import { SlateViewer } from 'components/Slate/index.js'
import { get, isUndefined } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Label, Segment } from 'semantic-ui-react'
import { getMCQ, readMCQAnswer } from 'store/actions/mcqs.js'
import { emptyArray } from 'utils/defaults'

function MCQListItem({ mcqId, mcq, getMCQ, answerId, readMCQAnswer, mcqTags }) {
  useEffect(() => {
    if (!mcq) getMCQ(mcqId)
  }, [getMCQ, mcq, mcqId, readMCQAnswer])

  useEffect(() => {
    if (isUndefined(answerId)) readMCQAnswer(mcqId)
  }, [answerId, mcqId, readMCQAnswer])

  if (!mcq) return null

  return (
    <>
      <Segment>
        <HeaderGrid
          Left={
            <Header>
              <Header.Subheader>ID: #{mcqId}</Header.Subheader>
              <SlateViewer initialValue={get(mcq, 'text')} />
            </Header>
          }
          Right={
            <>
              {!answerId && <Label color="yellow" content={`need answer`} />}
              <Permit teacher>
                <Button as={Link} to={`${mcqId}/edit`}>
                  Edit
                </Button>
              </Permit>
              <Button color="blue" as={Link} to={`${mcqId}`}>
                Open
              </Button>
            </>
          }
        />

        {mcq.tagIds.length ? (
          <Label.Group size="tiny" style={{ marginTop: '1em' }}>
            {get(mcq, 'tagIds', emptyArray).map(id => (
              <Label key={id}>{get(mcqTags.byId, [id, 'name'])}</Label>
            ))}
          </Label.Group>
        ) : null}
      </Segment>
    </>
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
)(MCQListItem)
