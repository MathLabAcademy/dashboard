export const sidebarItems = [
  {
    title: `Dashboard`,
    link: '/',
  },
  {
    title: `Profile`,
    link: '/profile',
  },
  {
    title: `Users`,
    link: '/users',
    permits: ['teacher'],
  },
  {
    title: `Find User`,
    link: '/find-user',
    permits: ['teacher'],
  },
  {
    title: `Online Courses`,
    link: '/courses',
    permits: ['teacher', 'student'],
    items: [
      {
        title: `Tags`,
        link: '/courses/tags',
        permits: ['teacher'],
      },
    ],
  },
  {
    title: `MCQs`,
    link: '/mcqs',
    permits: ['teacher', 'assistant'],
    items: [
      {
        title: `Tags`,
        link: '/mcqs/tags',
        permits: ['teacher', 'assistant'],
      },
    ],
  },
  {
    title: `Batch Classes`,
    link: '/batchclasses',
    permits: ['teacher'],
  },
  {
    title: `Batch Courses`,
    link: '/batchcourses',
    permits: ['teacher'],
  },
  {
    title: `Notification`,
    link: '/notifications',
  },
  {
    title: `SMS`,
    link: `/sms`,
    permits: ['teacher'],
  },
]
