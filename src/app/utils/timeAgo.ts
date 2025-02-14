import DateDiff from "date-diff";

export function getTimeAgo(dateString: string | Date): string {
  const createdAt = new Date(dateString);
  const now = new Date();
  const diff = new DateDiff(now, createdAt);

  if (diff.years() >= 1) {
    return `${Math.floor(diff.years())} years ago`;
  } else if (diff.months() >= 1) {
    return `${Math.floor(diff.months())} months ago`;
  } else if (diff.days() >= 1) {
    return `${Math.floor(diff.days())} days ago`;
  } else if (diff.hours() >= 1) {
    return `${Math.floor(diff.hours())} hours ago`;
  } else if (diff.minutes() >= 1) {
    return `${Math.floor(diff.minutes())} minutes ago`;
  } else {
    return "Just now";
  }
}
