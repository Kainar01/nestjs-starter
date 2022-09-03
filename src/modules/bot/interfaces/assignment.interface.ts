export interface Assignment {
  title: string;
  date: Date;
  link: string;
  courseTitle: string;
  eventId: string;
}

export interface AssignmentListRO {
  events?: Assignment[];
  error: string | null;
}

export interface FormattedAssignmentListRO {
  assignments: string;
  error: string | null;
}
