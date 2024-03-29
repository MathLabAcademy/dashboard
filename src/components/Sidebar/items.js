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
    permits: ['teacher', 'analyst'],
  },
  {
    title: `Find User`,
    link: '/find-user',
    permits: ['teacher', 'analyst'],
  },
  {
    title: `Courses`,
    link: '/courses',
    permits: ['teacher', 'analyst', 'assistant', 'student'],
    items: [
      {
        title: `Tags`,
        link: '/courses/tags',
        permits: ['teacher', 'analyst', 'assistant'],
      },
    ],
  },
  {
    title: `MCQs`,
    link: '/mcqs',
    permits: ['teacher', 'analyst', 'assistant'],
    items: [
      {
        title: `Tags`,
        link: '/mcqs/tags',
        permits: ['teacher', 'analyst', 'assistant'],
      },
    ],
  },
  {
    title: `Notification`,
    link: '/notifications',
  },
  {
    title: `SMS`,
    link: `/sms`,
    permits: ['teacher', 'analyst'],
  },
]
