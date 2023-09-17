import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Link, Route, Routes } from 'react-router-dom'
import { Button, Header, Segment } from 'semantic-ui-react'
import { getBatchClass } from 'store/actions/batches'
import Enrollments from './enrollments/Main'
import Fees from './fees/Main'
import Payments from './payments/Main'

function BatchClassView({ batchClassId, batchClass, getBatchClass }) {
  useEffect(() => {
    if (!batchClass) getBatchClass(batchClassId)
  }, [batchClassId, batchClass, getBatchClass])

  return (
    <>
      <Segment>
        <HeaderGrid
          Left={
            <Header>
              <Header.Subheader>
                ID: {String(batchClassId).padStart(2, '0')}
              </Header.Subheader>
              {get(batchClass, 'name')}
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
              <Button color="blue" as={Link} to={`fees`}>
                Fees
              </Button>
              <Button color="orange" as={Link} to={`payments`}>
                Payments
              </Button>
            </>
          }
        />
      </Segment>

      <Routes>
        <Route element={<Fees batchClassId={batchClassId} />} path="fees/*" />
        <Route
          element={<Payments batchClassId={batchClassId} />}
          path="payments/*"
        />
        <Route
          element={<Enrollments batchClassId={batchClassId} />}
          path="/*"
        />
      </Routes>
    </>
  )
}

const mapStateToProps = ({ batches }, { batchClassId }) => ({
  batchClass: get(batches.classes.byId, batchClassId),
})

const mapDispatchToProps = {
  getBatchClass,
}

export default connect(mapStateToProps, mapDispatchToProps)(BatchClassView)
