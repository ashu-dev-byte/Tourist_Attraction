const date = Date.now();

const dateTimeFormat = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

const [
  { value: month },
  ,
  { value: day },
  ,
  { value: year },
] = dateTimeFormat.formatToParts(date);

const res = `${day} ${month}, ${year}`;

module.exports = res;
