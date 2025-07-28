// utils/dateUtils.js
export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { 
    weekday: "short",
    year: "numeric", 
    month: "short", 
    day: "numeric" 
  });
};

export const formatTime = (timeStr) => {
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const isTimeValid = (startTime, endTime) => {
  if (!startTime || !endTime) return true;
  return startTime < endTime;
};

export const getWeekDates = (startDate) => {
  const dates = [];
  const start = new Date(startDate + "T00:00:00");
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
};

export const getCurrentWeekStart = () => {
  const today = new Date();
  const monday = new Date(today.setDate(today.getDate() - today.getDay() + 1));
  return monday.toISOString().split("T")[0];
};

export const extractDate = (dateStr) => {
  if (typeof dateStr === 'string' && dateStr.includes('T')) {
    return dateStr.split('T')[0];
  }
  return dateStr;
};
