import Course from 'components/Course/Main'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getAllEnrollments } from 'store/courses'

function CourseView({ getAllEnrollments }) {
  const { courseId } = useParams()

  useEffect(() => {
    getAllEnrollments(courseId)
  }, [courseId, getAllEnrollments])

  return <Course courseId={courseId} />
}

const mapDispatchToProps = {
  getAllEnrollments,
}

export default connect(null, mapDispatchToProps)(CourseView)
