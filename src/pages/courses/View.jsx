import Course from 'components/Course/Main'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getAllEnrollments, getCourse } from 'store/courses'
import { useCourse } from 'store/courses/hooks'

function CourseView({ getCourse, getAllEnrollments }) {
  const { courseId } = useParams()
  const course = useCourse(courseId)

  useEffect(() => {
    if (!course) getCourse(courseId)
  }, [courseId, course, getCourse])

  useEffect(() => {
    getAllEnrollments(courseId)
  }, [courseId, getAllEnrollments])

  return <Course courseId={courseId} />
}

const mapDispatchToProps = {
  getCourse,
  getAllEnrollments,
}

export default connect(null, mapDispatchToProps)(CourseView)
