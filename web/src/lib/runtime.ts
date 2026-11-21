// A chapter's or a book's length in the audiobook's chapter list: "46 min", "1 h 2 min", "7 h 19 min".
// It rounds to whole minutes before splitting off the hours, so 59:51 reads "1 h 0 min" (not "60 min")
// and 1:59:45 reads "2 h 0 min" (not "1 h 60 min").
export function runtime(seconds: number) {
  const minutes = Math.round(seconds / 60), h = Math.floor(minutes / 60), m = minutes % 60;
  return h ? `${h} h ${m} min` : `${m} min`;
}
