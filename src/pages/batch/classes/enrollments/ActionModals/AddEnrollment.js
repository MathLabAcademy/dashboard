import Permit from 'components/Permit'
import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import AddEnrollmentOldStudent from './AddEnrollmentOldStudent'
import AddEnrollmentNewStudent from './AddEnrollmentNewStudent'
import AddEnrollmentBulk from './AddEnrollmentBulk'

function AddEnrollment({ batchClassId, year, refreshData }) {
  return (
    <Permit roles="teacher,analyst">
      <Dropdown
        text="Add Enrollment"
        icon="add user"
        floating
        labeled
        button
        className="icon"
      >
        <Dropdown.Menu>
          <Dropdown.Item>
            <AddEnrollmentOldStudent batchClassId={batchClassId} year={year} />
          </Dropdown.Item>
          <Dropdown.Item>
            <AddEnrollmentNewStudent batchClassId={batchClassId} year={year} />
          </Dropdown.Item>
          <Dropdown.Item>
            <AddEnrollmentBulk
              batchClassId={batchClassId}
              year={year}
              refreshData={refreshData}
            />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Permit>
  )
}

export default AddEnrollment
