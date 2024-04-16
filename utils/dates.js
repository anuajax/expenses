const getLastOfMonth = () => {
    let today = new Date();
    let tomorrow = new Date(today.getFullYear(), today.getMonth()+1, 0);
    return tomorrow;
}

function calculateNextRun(frequency, interval, dayOfMonth, lastPerformed) {
    const nextDate = new Date(lastPerformed.getTime());
    switch (frequency) {
      case 'Day':
        nextDate.setDate(nextDate.getDate() + interval);
        break;
      case 'Week':
        nextDate.setDate(nextDate.getDate() + 7*interval);
        break;
      case 'Month':
        nextDate.setMonth(nextDate.getMonth() + interval);
        nextDate.setDate(dayOfMonth);
        break;
      case 'Year':
        nextDate.setFullYear(nextDate.getFullYear + 1);
        break;
      case 'LastOfMonth':
        nextDate.setDate(getLastOfMonth());
        break;
      case 'Minute':
        nextDate.setMinutes(nextDate.getMinutes()+interval);
        break;
      default:
        throw new Error('Invalid frequency');
    }
  console.log(nextDate);
    return nextDate;
  }

module.exports = {calculateNextRun, getLastOfMonth}