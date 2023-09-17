import { Link } from 'react-router-dom'
import FormCheckbox from 'components/Form/Checkbox'
import Form from 'components/Form/Form'
import HeaderGrid from 'components/HeaderGrid'
import Permit from 'components/Permit'
import { Formik } from 'formik'
import { get } from 'lodash-es'
import React, { useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { Button, Header, Message, Segment, Table } from 'semantic-ui-react'
import { enroll } from 'store/courses'
import { trackEventAnalytics } from 'utils/analytics'
import { emptyArray } from 'utils/defaults'
import * as Yup from 'yup'

const getValidationSchema = () => {
  return Yup.object({
    price: Yup.number().integer().required(`required`),
    // couponId: Yup.string().notRequired(),
    confirm: Yup.bool().oneOf([true], 'must confirm').required(`required`),
  })
}

const getInitialValues = (course) => ({
  price: get(course, 'price') / 100,
  // couponId: '',
  confirm: false,
})

function CourseEnroll({ courseId, course, enrollments, currentUser, enroll }) {
  const isEnrolled = useMemo(() => {
    return enrollments.includes(currentUser.id)
  }, [currentUser.id, enrollments])

  const initialValues = useMemo(() => getInitialValues(course), [course])
  const validationSchema = useMemo(() => getValidationSchema(), [])

  const onSubmit = useCallback(
    async (_, actions) => {
      actions.setStatus(null)

      try {
        await enroll(courseId, {})

        trackEventAnalytics({
          category: 'Student',
          action: 'Enrolled in Course',
        })

        window.location.reload()
      } catch (err) {
        if (err.errors) {
          err.errors.forEach(({ param, message }) =>
            actions.setFieldError(param, message)
          )
        } else if (err.message) {
          actions.setStatus(err.message)
        } else {
          actions.setStatus(null)
          console.error(err)
        }
      }

      actions.setSubmitting(false)
    },
    [courseId, enroll]
  )

  const amountDeficit = useMemo(() => {
    const balance = get(currentUser, 'balance')
    const creditLimit = get(currentUser, 'creditLimit')
    const price = get(course, 'price')

    const balanceAfterCharged = balance - price
    const balanceAfterCreditApplied = creditLimit + balanceAfterCharged

    return balanceAfterCreditApplied
  }, [course, currentUser])

  return (
    <Permit roles="student">
      {isEnrolled ? (
        <Segment>
          <HeaderGrid
            Left={<Header>You are already enrolled!</Header>}
            Right={
              <Button as={Link} to="..">
                Go Back
              </Button>
            }
          />
        </Segment>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={onSubmit}
        >
          {({ isSubmitting, isValid, values, status }) => (
            <Segment as={Form}>
              <HeaderGrid
                Left={<Header>Enroll</Header>}
                Right={
                  <>
                    <Button as={Link} to="..">
                      Cancel
                    </Button>
                    <Button type="reset">Reset</Button>
                    <Button
                      positive
                      type="submit"
                      loading={isSubmitting}
                      disabled={!isValid || isSubmitting}
                    >
                      Enroll
                    </Button>
                  </>
                }
              />

              <Message
                color="yellow"
                // hidden={amountDeficit >= 0 || !!values.couponId}
                hidden={amountDeficit >= 0}
              >
                Credit limit will exceed! You need to pay your dues before you
                can enroll in this course.
              </Message>

              <Message color="yellow" hidden={!status}>
                {status}
              </Message>

              <Table basic="very" compact className="horizontal-info">
                <Table.Body>
                  <Table.Row>
                    <Table.HeaderCell collapsing content={`Course Price`} />
                    <Table.Cell>
                      {Number(values.price).toFixed(2)} BDT
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.HeaderCell
                      collapsing
                      content={`Your Account Balance`}
                    />
                    <Table.Cell>
                      BDT {Number(get(currentUser, 'balance') / 100).toFixed(2)}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.HeaderCell
                      collapsing
                      content={`Your Credit Limit`}
                    />
                    <Table.Cell>
                      BDT{' '}
                      {Number(get(currentUser, 'creditLimit') / 100).toFixed(2)}
                    </Table.Cell>
                  </Table.Row>
                  {/* <Table.Row> */}
                  {/*   <Table.HeaderCell collapsing content={`Coupon`} /> */}
                  {/*   <Table.Cell> */}
                  {/*     <FormInput */}
                  {/*       id="couponId" */}
                  {/*       name="couponId" */}
                  {/*       label={`Coupon`} */}
                  {/*       hideLabel */}
                  {/*     /> */}
                  {/*   </Table.Cell> */}
                  {/* </Table.Row> */}

                  <Table.Row>
                    <Table.HeaderCell />
                    <Table.Cell>
                      <FormCheckbox
                        name="confirm"
                        label={`I want to enroll in this course`}
                      />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Segment>
          )}
        </Formik>
      )}
    </Permit>
  )
}

const mapStateToProps = ({ courses, user }, { courseId }) => ({
  course: get(courses.byId, courseId),
  enrollments: get(courses, ['enrollmentsById', courseId], emptyArray),
  currentUser: user.data,
})

const mapDispatchToProps = {
  enroll,
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseEnroll)
