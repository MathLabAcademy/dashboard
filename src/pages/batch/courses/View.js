import { Link, Router } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit.js'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment } from 'semantic-ui-react'
import { getBatchCourse } from 'store/actions/batches.js'
import Enrollments from './enrollments/Main'

function BatchCourseView({ batchCourseId, batchCourse, getBatchCourse }) {
  useEffect(() => {
    if (!batchCourse) getBatchCourse(batchCourseId)
  }, [batchCourseId, batchCourse, getBatchCourse])

  return (
    <>
      <Segment>
        <HeaderGrid
          Left={
            <Header>
              <Header.Subheader>ID: {batchCourseId}</Header.Subheader>
              {get(batchCourse, 'name')}
              <br />
              <small>
                Fee Amount: {get(batchCourse, 'feeAmount') / 100} BDT
              </small>
            </Header>
          }
          Right={
            <>
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
      </Segment>

      <Router>
        {/* <Fees path="fees/*" batchClassId={batchCourseId} /> */}
        <Enrollments path="/*" batchCourseId={batchCourseId} />
      </Router>
    </>
  )
}

const mapStateToProps = ({ batches }, { batchCourseId }) => ({
  batchCourse: get(batches.courses.byId, batchCourseId)
})

const mapDispatchToProps = {
  getBatchCourse
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BatchCourseView)
