import { Link } from '@reach/router'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { get } from 'lodash-es'
import { DateTime } from 'luxon'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Segment, Table } from 'semantic-ui-react'
import { getCQExam } from 'store/actions/cqExams'

function CourseCQExamView({ courseId, cqExamId, cqExam, getCQExam }) {
  useEffect(() => {
    if (!cqExam) getCQExam(cqExamId)
  }, [cqExam, getCQExam, cqExamId])

  return (
    <>
      <Segment loading={!cqExam}>
        <HeaderGrid
          Left={
            <Header>
              CQ Exam: {get(cqExam, 'name')}
              <Header.Subheader>{get(cqExam, 'description')}</Header.Subheader>
            </Header>
          }
          Right={
            <>
              <Permit teacher>
                <Button as={Link} to={`edit`}>
                  Edit
                </Button>
              </Permit>
            </>
          }
        />

        <Table basic="very" compact className="horizontal-info">
          <Table.Body>
            <Table.Row>
              <Table.HeaderCell collapsing content={`Date`} />
              <Table.Cell
                content={DateTime.fromISO(get(cqExam, 'date')).toLocaleString(
                  DateTime.DATE_MED
                )}
              />
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell collapsing content={`Question Paper`} />
              <Table.Cell
                content={
                  <Button
                    as="a"
                    href={`/api${get(cqExam, 'filePath')}`}
                    target="_blank"
                  >
                    Download
                  </Button>
                }
              />
            </Table.Row>
          </Table.Body>
        </Table>
      </Segment>
    </>
  )
}
const mapStateToProps = ({ cqExams }, { cqExamId }) => ({
  cqExam: get(cqExams.byId, cqExamId)
})

const mapDispatchToProps = {
  getCQExam
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseCQExamView)
