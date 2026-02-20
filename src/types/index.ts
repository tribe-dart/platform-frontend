// ─── User & Auth ───
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'student' | 'instructor' | 'admin' | 'ta';
  bio?: string;
  location?: string;
  timezone?: string;
}

// ─── Programme ───
export interface Programme {
  id: string;
  title: string;
  institution: string;
  description: string;
  bannerImage?: string;
  startDate: string;
  endDate: string;
  progress: number; // 0-100
  courseCount: number;
  courses: Course[];
}

// ─── Course ───
export interface Course {
  id: string;
  programmeId: string;
  title: string;
  description: string;
  image?: string;
  instructors: User[];
  progress: number;
  weekCount: number;
  screenCount: number;
  completedScreens: number;
  status: 'not_started' | 'in_progress' | 'completed';
  weeks: Week[];
}

// ─── Week ───
export interface Week {
  id: string;
  courseId: string;
  number: number;
  title: string;
  description?: string;
  screens: Screen[];
  isCompleted: boolean;
  progress: number;
  releaseDate?: string;
}

// ─── Screen ───
export interface Screen {
  id: string;
  weekId: string;
  number: number;
  title: string;
  estimatedTime?: number; // minutes
  status: 'unread' | 'review' | 'done';
  activities: Activity[];
  narrativeText?: string;
}

// ─── Activity ───
export type ActivityType =
  | 'reading'
  | 'video_player'
  | 'interactive_video'
  | 'summative_quiz'
  | 'formative_quiz'
  | 'discussion'
  | 'forum'
  | 'poll'
  | 'matrix_poll'
  | 'whiteboard'
  | 'sticky_note'
  | 'wordcloud'
  | 'bubblecloud'
  | 'reveal'
  | 'text_reveal'
  | 'audio'
  | 'exam'
  | 'timed_exam'
  | 'file_upload'
  | 'video_submission'
  | 'question'
  | 'journal'
  | 'live_class'
  | 'learning_outcomes'
  | 'explanatory_text'
  | 'information_box'
  | 'gap_fill'
  | 'ordering'
  | 'drag_drop_table'
  | 'image_drag_drop'
  | 'image_tile'
  | 'interactive_table'
  | 'quick_answer_check'
  | 'geotagging'
  | 'participation_grade'
  | 'pronunciation_checker'
  | 'scorm_player';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  content?: string; // HTML content
  isAssessed?: boolean;
  isCommunity?: boolean;
  config?: Record<string, unknown>;
}

// ─── Newsfeed ───
export interface NewsfeedPost {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  attachments?: string[];
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
  likes: number;
}

// ─── Calendar ───
export interface CalendarEvent {
  id: string;
  title: string;
  type: 'assignment' | 'live_class' | 'quiz' | 'exam' | 'deadline' | 'other';
  startDate: string;
  endDate?: string;
  courseTitle?: string;
  description?: string;
  link?: string;
}

// ─── Grades ───
export interface Grade {
  id: string;
  activityTitle: string;
  courseTitle: string;
  score: number;
  maxScore: number;
  weight: number;
  status: 'submitted' | 'graded' | 'pending' | 'late';
  feedback?: string;
  submittedAt?: string;
  gradedAt?: string;
}

// ─── Team ───
export interface TeamMember extends User {
  isOnline: boolean;
  courses: string[];
  group?: string;
}

// ─── Notification ───
export interface Notification {
  id: string;
  type: 'grade' | 'announcement' | 'discussion' | 'deadline' | 'newsfeed' | 'submission';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  link?: string;
}
