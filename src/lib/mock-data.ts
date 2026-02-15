import type { Programme, Course, Week, Screen, Activity, User, TeamMember, NewsfeedPost, CalendarEvent, Grade, Notification } from '@/types';

// ─── Current User ───
export const currentUser: User = {
  id: 'u1',
  email: 'gyagadu@gmail.com',
  firstName: 'Richard',
  lastName: 'Yagadu',
  role: 'student',
  avatar: '',
  bio: 'Executive MBA student passionate about technology and leadership.',
  location: 'Accra, Ghana',
  timezone: 'Africa/Accra',
};

// ─── Users ───
const users: User[] = [
  currentUser,
  { id: 'u2', email: 'sarah@example.com', firstName: 'Sarah', lastName: 'Chen', role: 'instructor', avatar: '', bio: 'Professor of Digital Strategy' },
  { id: 'u3', email: 'james@example.com', firstName: 'James', lastName: 'Wilson', role: 'student', avatar: '', bio: 'Product Manager at TechCorp' },
  { id: 'u4', email: 'amara@example.com', firstName: 'Amara', lastName: 'Osei', role: 'student', avatar: '', bio: 'Entrepreneur and startup founder' },
  { id: 'u5', email: 'priya@example.com', firstName: 'Priya', lastName: 'Sharma', role: 'ta', avatar: '', bio: 'Teaching Assistant - Finance' },
  { id: 'u6', email: 'michael@example.com', firstName: 'Michael', lastName: 'Brown', role: 'student', avatar: '', bio: 'Senior Consultant at Deloitte' },
  { id: 'u7', email: 'fatima@example.com', firstName: 'Fatima', lastName: 'Al-Hassan', role: 'student', avatar: '', bio: 'Healthcare Innovation Lead' },
  { id: 'u8', email: 'david@example.com', firstName: 'David', lastName: 'Kim', role: 'instructor', avatar: '', bio: 'Professor of Finance and Accounting' },
];

// ─── Activities ───
const sampleActivities: Activity[] = [
  {
    id: 'act1',
    type: 'video_player',
    title: 'Introduction to Digital Transformation',
    description: 'Watch this introductory video on the key concepts of digital transformation.',
    content: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    config: { provider: 'youtube' },
  },
  {
    id: 'act2',
    type: 'explanatory_text',
    title: 'Key Concepts',
    content: '<p>Digital transformation is the process of using digital technologies to create new — or modify existing — business processes, culture, and customer experiences to meet changing business and market requirements.</p><p>This reimagining of business in the digital age is digital transformation. It transcends traditional roles like sales, marketing, and customer service.</p>',
  },
  {
    id: 'act3',
    type: 'reading',
    title: 'Required Reading: The Digital Imperative',
    description: 'Read chapters 1-3 of the course textbook.',
    content: '<h3>The Digital Imperative</h3><p>In today\'s rapidly evolving business landscape, digital transformation has become not just an option but a necessity for survival and growth. Organizations across industries are leveraging digital technologies to fundamentally change how they operate and deliver value to customers.</p><p><strong>Key Takeaways:</strong></p><ul><li>Digital transformation affects every aspect of a business</li><li>Customer experience is at the heart of digital strategy</li><li>Data-driven decision making is essential</li><li>Agility and adaptability are competitive advantages</li></ul>',
    config: { estimatedTime: 15 },
  },
  {
    id: 'act4',
    type: 'poll',
    title: 'Quick Poll: Your Organization\'s Digital Maturity',
    description: 'How would you rate your organization\'s digital maturity?',
    config: {
      question: 'How would you rate your organization\'s current level of digital maturity?',
      options: ['Just getting started', 'Early stages', 'Developing', 'Advanced', 'Industry leader'],
      results: [12, 28, 35, 18, 7],
      chartType: 'bar',
    },
  },
  {
    id: 'act5',
    type: 'question',
    title: 'Reflection: Digital Transformation in Your Context',
    description: 'Consider how digital transformation applies to your own organization.',
    content: '<p>Based on the reading and video, reflect on the following:</p>',
    config: {
      questions: [
        'What are the biggest digital transformation challenges facing your organization?',
        'Identify three areas where digital technologies could create the most value.',
      ],
    },
  },
  {
    id: 'act6',
    type: 'formative_quiz',
    title: 'Knowledge Check: Digital Transformation Basics',
    config: {
      questions: [
        {
          question: 'What is the primary driver of digital transformation?',
          options: ['Cost reduction', 'Customer experience', 'Technology adoption', 'Regulatory compliance'],
          correctIndex: 1,
          feedback: 'Customer experience is at the heart of digital transformation. While cost reduction and technology adoption are important, the primary goal is to improve how customers interact with and experience your business.',
        },
        {
          question: 'Which of the following is NOT a key pillar of digital transformation?',
          options: ['Data & Analytics', 'Cloud Computing', 'Manual Processes', 'AI & Machine Learning'],
          correctIndex: 2,
          feedback: 'Manual processes are what digital transformation aims to replace or augment with digital solutions.',
        },
        {
          question: 'Digital transformation primarily affects which department?',
          options: ['Only IT', 'Only Marketing', 'Only Operations', 'All departments'],
          correctIndex: 3,
          feedback: 'Digital transformation is an organization-wide initiative that affects all departments.',
        },
      ],
    },
  },
  {
    id: 'act7',
    type: 'whiteboard',
    title: 'Collaborative Brainstorm: Future of Work',
    description: 'Share your ideas about how digital transformation will shape the future of work.',
    isCommunity: true,
    config: {
      prompt: 'How will digital transformation reshape the workplace in the next 5 years?',
      submissions: [
        { id: 's1', author: 'James W.', text: 'Remote work will become the default, with AI assistants handling routine tasks.', votes: 12 },
        { id: 's2', author: 'Amara O.', text: 'Hybrid models with VR collaboration spaces will replace traditional offices.', votes: 8 },
        { id: 's3', author: 'Fatima A.', text: 'Continuous learning platforms will be embedded into daily workflows.', votes: 15 },
      ],
    },
  },
  {
    id: 'act8',
    type: 'information_box',
    title: 'Important Note',
    content: '<p><strong>Assignment Due:</strong> Your first case study analysis is due by the end of Week 2. Please review the assignment brief in the Assessment tab.</p>',
    config: { color: 'yellow' },
  },
  {
    id: 'act9',
    type: 'live_class',
    title: 'Live Session: Q&A with Prof. Chen',
    config: {
      date: '2026-02-20',
      time: '14:00 UTC',
      duration: 90,
      platform: 'Zoom',
      link: 'https://zoom.us/j/123456789',
      instructor: 'Prof. Sarah Chen',
    },
  },
  {
    id: 'act10',
    type: 'learning_outcomes',
    title: 'Learning Outcomes',
    config: {
      outcomes: [
        'Define digital transformation and its key components',
        'Identify the drivers and barriers of digital transformation',
        'Evaluate your organization\'s digital maturity level',
        'Develop a preliminary digital transformation roadmap',
      ],
    },
  },
];

// ─── Screens ───
const screens: Screen[] = [
  { id: 'scr1', weekId: 'w1', number: 1, title: 'Welcome & Learning Outcomes', estimatedTime: 5, status: 'done', activities: [sampleActivities[9], sampleActivities[1]], narrativeText: 'Welcome to Week 1 of Digital Transformation Strategy. This week, we will explore the foundations of digital transformation and why it matters for modern organizations.' },
  { id: 'scr2', weekId: 'w1', number: 2, title: 'What is Digital Transformation?', estimatedTime: 20, status: 'done', activities: [sampleActivities[0], sampleActivities[1]], narrativeText: 'Let\'s begin by understanding what digital transformation really means and how it differs from simple digitization.' },
  { id: 'scr3', weekId: 'w1', number: 3, title: 'The Digital Imperative', estimatedTime: 15, status: 'review', activities: [sampleActivities[2]], narrativeText: 'Now that you understand the basics, let\'s dive deeper into why digital transformation is imperative for organizations today.' },
  { id: 'scr4', weekId: 'w1', number: 4, title: 'Your Digital Maturity', estimatedTime: 10, status: 'unread', activities: [sampleActivities[3], sampleActivities[4]], narrativeText: 'Before we proceed, let\'s assess where you and your organization currently stand on the digital maturity spectrum.' },
  { id: 'scr5', weekId: 'w1', number: 5, title: 'Knowledge Check & Wrap-up', estimatedTime: 15, status: 'unread', activities: [sampleActivities[5], sampleActivities[7]], narrativeText: 'Let\'s test your understanding of this week\'s material and prepare for next week.' },
  { id: 'scr6', weekId: 'w2', number: 1, title: 'Frameworks for Digital Strategy', estimatedTime: 25, status: 'unread', activities: [sampleActivities[0], sampleActivities[1]], narrativeText: 'This week we explore the key frameworks used to develop digital transformation strategies.' },
  { id: 'scr7', weekId: 'w2', number: 2, title: 'Case Study: Netflix', estimatedTime: 30, status: 'unread', activities: [sampleActivities[2], sampleActivities[4]], narrativeText: 'Let\'s examine how Netflix transformed from a DVD rental company to a global streaming giant.' },
  { id: 'scr8', weekId: 'w2', number: 3, title: 'Live Session Preparation', estimatedTime: 10, status: 'unread', activities: [sampleActivities[8], sampleActivities[7]], narrativeText: 'Prepare for our upcoming live session with Prof. Chen.' },
  { id: 'scr9', weekId: 'w2', number: 4, title: 'Collaborative Discussion', estimatedTime: 20, status: 'unread', activities: [sampleActivities[6]], narrativeText: 'Share your insights with your peers on the future of digital work.' },
  { id: 'scr10', weekId: 'w3', number: 1, title: 'Data-Driven Decision Making', estimatedTime: 25, status: 'unread', activities: [sampleActivities[0], sampleActivities[1]], narrativeText: 'In this week, we explore how data analytics powers digital transformation.' },
  { id: 'scr11', weekId: 'w3', number: 2, title: 'AI and Machine Learning Fundamentals', estimatedTime: 30, status: 'unread', activities: [sampleActivities[2], sampleActivities[5]], narrativeText: 'Understanding the role of AI and ML in modern business.' },
  { id: 'scr12', weekId: 'w3', number: 3, title: 'Ethics in Digital Transformation', estimatedTime: 20, status: 'unread', activities: [sampleActivities[4], sampleActivities[6]], narrativeText: 'Exploring the ethical considerations of digital transformation.' },
];

// ─── Weeks ───
const weeks: Week[] = [
  { id: 'w1', courseId: 'c1', number: 1, title: 'Foundations of Digital Transformation', description: 'Understand the core concepts, drivers, and frameworks of digital transformation.', screens: screens.filter(s => s.weekId === 'w1'), isCompleted: false, progress: 50 },
  { id: 'w2', courseId: 'c1', number: 2, title: 'Digital Strategy Frameworks', description: 'Explore strategic frameworks and real-world case studies of digital transformation.', screens: screens.filter(s => s.weekId === 'w2'), isCompleted: false, progress: 0 },
  { id: 'w3', courseId: 'c1', number: 3, title: 'Data, AI & Ethics', description: 'Dive into data-driven decision making, AI fundamentals, and ethical considerations.', screens: screens.filter(s => s.weekId === 'w3'), isCompleted: false, progress: 0 },
];

// ─── Courses ───
const courses: Course[] = [
  {
    id: 'c1',
    programmeId: 'p1',
    title: 'Digital Transformation Strategy',
    description: 'Learn how to lead digital transformation initiatives in your organization. This course covers frameworks, case studies, and practical tools for developing and executing digital strategies.',
    instructors: [users[1]],
    progress: 25,
    weekCount: 3,
    screenCount: 12,
    completedScreens: 3,
    status: 'in_progress',
    weeks,
  },
  {
    id: 'c2',
    programmeId: 'p1',
    title: 'Financial Management & Analysis',
    description: 'Master the fundamentals of financial management, including financial statement analysis, capital budgeting, and risk management.',
    instructors: [users[7]],
    progress: 0,
    weekCount: 4,
    screenCount: 16,
    completedScreens: 0,
    status: 'not_started',
    weeks: [],
  },
  {
    id: 'c3',
    programmeId: 'p1',
    title: 'Leadership in the Digital Age',
    description: 'Develop leadership skills for the digital era. Explore adaptive leadership, change management, and building high-performing teams.',
    instructors: [users[1]],
    progress: 0,
    weekCount: 3,
    screenCount: 10,
    completedScreens: 0,
    status: 'not_started',
    weeks: [],
  },
];

// ─── Programmes ───
export const programmes: Programme[] = [
  {
    id: 'p1',
    title: 'Executive MBA in Digital Leadership',
    institution: 'Imperial College Business School',
    description: 'A comprehensive programme designed for senior professionals looking to lead digital transformation in their organizations. Combines cutting-edge digital strategy with traditional MBA fundamentals.',
    bannerImage: '',
    startDate: '2026-01-15',
    endDate: '2026-12-15',
    progress: 12,
    courseCount: 3,
    courses,
  },
];

// ─── Team Members ───
export const teamMembers: TeamMember[] = users.map((u, i) => ({
  ...u,
  isOnline: i < 4,
  courses: i < 5 ? ['Digital Transformation Strategy', 'Financial Management & Analysis'] : ['Leadership in the Digital Age'],
  group: i % 2 === 0 ? 'Group A' : 'Group B',
}));

// ─── Newsfeed ───
export const newsfeedPosts: NewsfeedPost[] = [
  {
    id: 'nf1',
    author: users[1],
    content: 'Welcome to the Executive MBA programme! I\'m excited to be your instructor for Digital Transformation Strategy. Please make sure to complete the pre-course survey before our first live session next week.',
    createdAt: '2026-02-13T10:00:00Z',
    likes: 24,
    isLiked: true,
    comments: [
      { id: 'c1', author: users[2], content: 'Looking forward to it, Professor Chen!', createdAt: '2026-02-13T10:30:00Z', likes: 5 },
      { id: 'c2', author: users[3], content: 'Excited to start this journey!', createdAt: '2026-02-13T11:00:00Z', likes: 3 },
    ],
  },
  {
    id: 'nf2',
    author: users[3],
    content: 'Just finished the first week of Digital Transformation Strategy. The case studies are incredibly relevant to what we\'re experiencing in our industry. Anyone else finding parallels with their own organizations?',
    createdAt: '2026-02-12T15:00:00Z',
    likes: 18,
    isLiked: false,
    comments: [
      { id: 'c3', author: users[5], content: 'Absolutely! The Netflix case study mirrors our own transformation journey.', createdAt: '2026-02-12T16:00:00Z', likes: 7 },
    ],
  },
  {
    id: 'nf3',
    author: users[6],
    content: 'Does anyone have the Zoom link for tomorrow\'s live session? I can\'t seem to find it in the course materials.',
    createdAt: '2026-02-11T09:00:00Z',
    likes: 2,
    isLiked: false,
    comments: [
      { id: 'c4', author: users[4], content: 'You can find it under Week 2, Screen 3 - "Live Session Preparation". The link is in the Live Class activity.', createdAt: '2026-02-11T09:15:00Z', likes: 8 },
    ],
  },
];

// ─── Calendar Events ───
export const calendarEvents: CalendarEvent[] = [
  { id: 'ev1', title: 'Live Session: Q&A with Prof. Chen', type: 'live_class', startDate: '2026-02-20T14:00:00Z', endDate: '2026-02-20T15:30:00Z', courseTitle: 'Digital Transformation Strategy', link: 'https://zoom.us/j/123456789' },
  { id: 'ev2', title: 'Case Study Analysis Due', type: 'assignment', startDate: '2026-02-25T23:59:00Z', courseTitle: 'Digital Transformation Strategy', description: 'Submit your Netflix case study analysis' },
  { id: 'ev3', title: 'Week 3 Materials Released', type: 'other', startDate: '2026-02-22T00:00:00Z', courseTitle: 'Digital Transformation Strategy' },
  { id: 'ev4', title: 'Financial Management Starts', type: 'other', startDate: '2026-03-01T00:00:00Z', courseTitle: 'Financial Management & Analysis' },
  { id: 'ev5', title: 'Mid-term Quiz', type: 'quiz', startDate: '2026-03-10T10:00:00Z', endDate: '2026-03-10T11:00:00Z', courseTitle: 'Digital Transformation Strategy' },
  { id: 'ev6', title: 'Group Presentation', type: 'assignment', startDate: '2026-03-15T14:00:00Z', courseTitle: 'Digital Transformation Strategy' },
];

// ─── Grades ───
export const grades: Grade[] = [
  { id: 'g1', activityTitle: 'Digital Maturity Assessment', courseTitle: 'Digital Transformation Strategy', score: 85, maxScore: 100, weight: 10, status: 'graded', feedback: 'Excellent analysis of your organization\'s digital maturity. Your recommendations are well-structured and actionable.', submittedAt: '2026-02-10T12:00:00Z', gradedAt: '2026-02-12T09:00:00Z' },
  { id: 'g2', activityTitle: 'Week 1 Quiz', courseTitle: 'Digital Transformation Strategy', score: 90, maxScore: 100, weight: 5, status: 'graded', feedback: 'Great understanding of the core concepts.', submittedAt: '2026-02-08T15:00:00Z', gradedAt: '2026-02-08T15:00:00Z' },
  { id: 'g3', activityTitle: 'Case Study Analysis: Netflix', courseTitle: 'Digital Transformation Strategy', score: 0, maxScore: 100, weight: 20, status: 'pending', submittedAt: undefined },
  { id: 'g4', activityTitle: 'Participation Grade', courseTitle: 'Digital Transformation Strategy', score: 78, maxScore: 100, weight: 15, status: 'graded', feedback: 'Good participation in discussions. Try to engage more in the whiteboard activities.', submittedAt: undefined, gradedAt: '2026-02-14T09:00:00Z' },
];

// ─── Notifications ───
export const notifications: Notification[] = [
  { id: 'n1', type: 'grade', title: 'Grade Released', message: 'Your grade for "Digital Maturity Assessment" has been released.', createdAt: '2026-02-12T09:00:00Z', isRead: false, link: '/programmes/p1/grades' },
  { id: 'n2', type: 'announcement', title: 'New Post from Prof. Chen', message: 'Welcome to the Executive MBA programme!', createdAt: '2026-02-13T10:00:00Z', isRead: true, link: '/programmes/p1/newsfeed' },
  { id: 'n3', type: 'deadline', title: 'Upcoming Deadline', message: 'Case Study Analysis is due in 11 days.', createdAt: '2026-02-14T08:00:00Z', isRead: false, link: '/programmes/p1/courses/c1' },
  { id: 'n4', type: 'discussion', title: 'New Reply', message: 'James Wilson replied to your whiteboard submission.', createdAt: '2026-02-13T16:00:00Z', isRead: true },
  { id: 'n5', type: 'newsfeed', title: 'New Comment', message: 'Amara Osei commented on a post you liked.', createdAt: '2026-02-13T11:00:00Z', isRead: true },
];

// ─── Helper functions ───
export function getProgramme(id: string): Programme | undefined {
  return programmes.find(p => p.id === id);
}

export function getCourse(id: string): Course | undefined {
  return programmes.flatMap(p => p.courses).find(c => c.id === id);
}

export function getWeek(id: string): Week | undefined {
  return programmes.flatMap(p => p.courses).flatMap(c => c.weeks).find(w => w.id === id);
}

export function getScreen(id: string): Screen | undefined {
  return programmes.flatMap(p => p.courses).flatMap(c => c.weeks).flatMap(w => w.screens).find(s => s.id === id);
}
