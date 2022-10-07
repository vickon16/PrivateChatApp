import Moment from "react-moment";

export const flexCenter = (content, direction, items ) => `
  display: flex;
  align-items: ${items || "center"};
  ${content && `justify-content: ${content}`};
  ${ direction && `flex-direction: ${direction}`};
`;

export const formatDate = (timeStamp) => {
  const fireBaseTime = new Date(
    timeStamp.seconds * 1000 + timeStamp.nanoseconds / 1000000
  );
  const date = fireBaseTime.toDateString();
  const atTime = fireBaseTime.toLocaleTimeString();
  return `${date} at ${atTime}`
};

export const formatDateAgo = (timeStamp) => {
  const fireBaseTime = new Date(
    timeStamp.seconds * 1000 + timeStamp.nanoseconds / 1000000
  );
  const date = fireBaseTime.toISOString();
  return <Moment fromNow>{date}</Moment>
}

// export const formateDateTimeAgo = (timeStamp) => {
//   const fireBaseTime = new Date(
//     timeStamp.seconds * 1000 + timeStamp.nanoseconds / 1000000
//   );
//   const date = fireBaseTime.toISOString();
//   const parsed = parseISO(date);
//   const timePeriod = formatDistanceToNow(parsed);
//   return `${timePeriod} ago`;
// }
