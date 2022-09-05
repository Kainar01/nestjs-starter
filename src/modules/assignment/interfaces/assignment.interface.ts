export interface MoodleAssignment {
  title: string;
  date: Date;
  link: string;
  courseTitle: string;
  eventId: string;
}

export interface AssignmentListRO {
  events?: MoodleAssignment[];
  error: string | null;
}

export interface FormattedAssignmentListRO {
  assignments: string;
  error: string | null;
}

export enum AssignmentType {
  ASSIGNMENT = 'assignment',
  QUIZ = 'quiz',
}

export enum AssignmentStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  HIDDEN = 'hidden',
}

export interface Assignment {
  id: number;
  assignmentId: string;
  title: string;
  type: AssignmentType;
  link: string;
  courseTitle: string;
  deadline: Date;
  status: AssignmentStatus;
}
