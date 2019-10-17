import Permit from 'components/Permit'
import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import AddEnrollmentOldStudent from './AddEnrollmentOldStudent'
import AddEnrollmentNewStudent from './AddEnrollmentNewStudent'

function AddEnrollment({ batchCourseId, year }) {
  return (
    <Permit teacher>
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
            <AddEnrollmentOldStudent
              batchCourseId={batchCourseId}
              year={year}
            />
          </Dropdown.Item>
          <Dropdown.Item>
            <AddEnrollmentNewStudent
              batchCourseId={batchCourseId}
              year={year}
            />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Permit>
  )
}

export default AddEnrollment
