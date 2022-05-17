const formatDate = (value: Date): { date: string; time: string } => {
  const year = value.getFullYear();
  let month: string | number = value.getMonth() + 1;
  let day: string | number = value.getDate();
  let hour: string | number = value.getHours();
  let minute: string | number = value.getMinutes();
  let second: string | number = value.getSeconds();

  if (month < 10) {
    month = `0${month}`;
  }
  if (day < 10) {
    day = `0${day}`;
  }
  if (hour < 10) {
    hour = `0${hour}`;
  }
  if (minute < 10) {
    minute = `0${minute}`;
  }
  if (second < 10) {
    second = `0${second}`;
  }

  const date = [year, month, day].join('-');
  const time = [hour, minute, second].join(':');

  return { date, time };
};

export default formatDate;
