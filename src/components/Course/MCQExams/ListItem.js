import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment } from 'semantic-ui-react'
import { getMCQExam } from 'store/actions/mcqExams'

function CourseMCQExamListItem({ id, data, getData, linkToBase }) {
  useEffect(() => {
    if (!data) getData(id)
  }, [data, getData, id])

  return (
    <Segment loading={!data}>
      <HeaderGrid
        Left={<Header>{get(data, 'name')}</Header>}
        Right={
          <Button as={Link} to={`${linkToBase}${id}`}>
            Open
          </Button>
        }
      />
    </Segment>
  )
}

const mapStateToProps = ({ mcqExams }, { id }) => ({
  data: get(mcqExams.byId, id),
})

const mapDispatchToProps = {
  getData: getMCQExam,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseMCQExamListItem)
