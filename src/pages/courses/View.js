import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid.js'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment } from 'semantic-ui-react'
import { getCourse } from 'store/actions/courses.js'

function CourseView({ courseId, data, getData }) {
  useEffect(() => {
    if (!data) getData(courseId)
  }, [courseId, data, getData])

  return (
    <>
      <Segment loading={!data}>
        <HeaderGrid
          Left={
            <Header>
              {get(data, 'name')}
              <Header.Subheader>{get(data, 'description')}</Header.Subheader>
            </Header>
          }
          Right={
            <Button as={Link} to={`edit`}>
              Edit
            </Button>
          }
        />
      </Segment>
    </>
  )
}

const mapStateToProps = ({ courses }, { courseId }) => ({
  data: get(courses.byId, courseId)
})

const mapDispatchToProps = {
  getData: getCourse
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseView)
