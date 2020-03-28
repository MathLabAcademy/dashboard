import Course from 'components/Course/Main'
import { get } from 'lodash-es'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getCourse, getAllEnrollments } from 'store/courses'

function CourseView({ courseId, course, getCourse, getAllEnrollments }) {
  useEffect(() => {
    if (!course) getCourse(courseId)
  }, [courseId, course, getCourse])

  useEffect(() => {
    getAllEnrollments(courseId)
  }, [courseId, getAllEnrollments])

  return <Course courseId={courseId} />
}

const mapStateToProps = ({ courses }, { courseId }) => ({
  course: get(courses.byId, courseId),
})

const mapDispatchToProps = {
  getCourse,
  getAllEnrollments,
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseView)
