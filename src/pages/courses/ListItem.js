import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid.js'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment } from 'semantic-ui-react'
import { getCourse } from 'store/actions/courses.js'

function CourseListItem({ id, data, getData }) {
  useEffect(() => {
    if (!data) getData(id)
  }, [data, getData, id])

  return (
    <Segment loading={!data}>
      <HeaderGrid
        Left={<Header>{get(data, 'name')}</Header>}
        Right={
          <Button as={Link} to={`${id}`}>
            Open
          </Button>
        }
      />
    </Segment>
  )
}

const mapStateToProps = ({ courses }, { id }) => ({
  data: get(courses.byId, id)
})

const mapDispatchToProps = {
  getData: getCourse
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseListItem)
