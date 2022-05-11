export default function getCurrentTime() {
  let currentdate = new Date();
  let datetime =
    currentdate.getFullYear() +
    '/' +
    currentdate.getDate() +
    '/' +
    (currentdate.getMonth() + 1) +
    ' ' +
    currentdate.getHours() +
    ':' +
    currentdate.getMinutes() +
    ':' +
    currentdate.getSeconds();
  return datetime;
}
