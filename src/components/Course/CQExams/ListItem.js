import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment } from 'semantic-ui-react'
import { getCQExam } from 'store/actions/cqExams'
import { DateTime } from 'luxon'

function CourseCQExamListItem({ id, data, getData, linkToBase }) {
  useEffect(() => {
    if (!data) getData(id)
  }, [data, getData, id])

  return (
    <Segment loading={!data}>
      <HeaderGrid
        Left={
          <Header>
            [
            {DateTime.fromISO(get(data, 'date')).toLocaleString(
              DateTime.DATE_MED
            )}
            ] {get(data, 'name')}
          </Header>
        }
        Right={
          <Button as={Link} to={`${linkToBase}${id}`}>
            Open
          </Button>
        }
      />
    </Segment>
  )
}

const mapStateToProps = ({ cqExams }, { id }) => ({
  data: get(cqExams.byId, id),
})

const mapDispatchToProps = {
  getData: getCQExam,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseCQExamListItem)
