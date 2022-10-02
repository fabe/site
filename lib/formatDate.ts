import { format } from "date-fns";

export default function formatDate(date: string, short: boolean = false) {
  return format(new Date(date), short ? "MMM dd, yyyy" : "MMMM do, yyyy");
}
