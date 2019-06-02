import { Link, Router } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid.js'
import Permit from 'components/Permit'
import { SlateViewer } from 'components/Slate/index.js'
import { get } from 'lodash-es'
import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment, Table, Label } from 'semantic-ui-react'
import { emptyArray } from 'utils/defaults.js'
import CourseCQExams from './CQExams/Main.js'
import Enroll from './Enroll.js'
import CourseMCQExams from './MCQExams/Main.js'

function Course({ courseId, course, courseTags, enrollments, currentUser }) {
  const isEnrolled = useMemo(() => {
    return enrollments.includes(currentUser.id)
  }, [currentUser.id, enrollments])

  return (
    <>
      <Segment loading={!course}>
        <HeaderGrid
          Left={<Header>{get(course, 'name')}</Header>}
          Right={
            <>
              <Permit teacher>
                <Button as={Link} to={`edit`}>
                  Edit
                </Button>
              </Permit>

              <Permit student>
                {!isEnrolled && (
                  <Button as={Link} to={`enroll`}>
                    Enroll
                  </Button>
                )}
              </Permit>
            </>
          }
        />
      </Segment>

      <Segment>
        <Table basic="very" compact className="horizontal-info">
          <Table.Body>
            <Table.Row>
              <Table.HeaderCell collapsing content={`Desccription`} />
              <Table.Cell
                content={
                  <SlateViewer initialValue={get(course, 'description')} />
                }
              />
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell collapsing content={`Price`} />
              <Table.Cell content={`${get(course, 'price') / 100} BDT`} />
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell collapsing content={`Tags`} />
              <Table.Cell>
                {get(course, 'tagIds', emptyArray).map(id => (
                  <Label
                    key={id}
                    color="black"
                    size="tiny"
                    content={get(courseTags.byId, [id, 'name'])}
                  />
                ))}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Segment>

      <CourseCQExams courseId={courseId} />
      <CourseMCQExams courseId={courseId} />

      <Router>
        <Enroll path="enroll" courseId={courseId} />
      </Router>
    </>
  )
}

const mapStateToProps = ({ courses, courseTags, user }, { courseId }) => ({
  course: get(courses.byId, courseId),
  courseTags,
  enrollments: get(courses, ['enrollmentsById', courseId], emptyArray),
  currentUser: user.data
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Course)
