import { Link, Routes, Route } from 'react-router-dom'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment } from 'semantic-ui-react'
import { getBatchCourse } from 'store/actions/batches'
import Enrollments from './enrollments/Main'
import Payments from './payments/Main'

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
              <Permit roles="teacher">
                <Button as={Link} to={`edit`}>
                  Edit
                </Button>
              </Permit>
              <Button color="orange" as={Link} to={`payments`}>
                Payments
              </Button>
            </>
          }
        />
      </Segment>

      <Routes>
        <Route
          element={<Payments batchCourseId={batchCourseId} />}
          path="payments/*"
        />
        <Route
          element={<Enrollments batchCourseId={batchCourseId} />}
          path="/*"
        />
      </Routes>
    </>
  )
}

const mapStateToProps = ({ batches }, { batchCourseId }) => ({
  batchCourse: get(batches.courses.byId, batchCourseId),
})

const mapDispatchToProps = {
  getBatchCourse,
}

export default connect(mapStateToProps, mapDispatchToProps)(BatchCourseView)
