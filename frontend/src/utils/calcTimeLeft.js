export const timeLeft = (time) => {
    const remain = new Date(time).getTime() - new Date().getTime()

    if (remain < 0) return 'Time over!'

    const days = Math.floor(remain / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} ${(days > 1) ? 'days' : 'day'} left`

    const hours = Math.floor((remain % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (hours > 0) return `${hours} ${(hours > 1) ? 'hours' : 'hour'} left`

    const minutes = Math.floor((remain % (1000 * 60 * 60)) / (1000 * 60));
    if (minutes > 0) return `${minutes} ${(minutes > 1) ? 'minutes' : 'minute'} left`

    const seconds = Math.floor((remain % (1000 * 60)) / 1000);
    if (seconds > 0) return `${seconds} ${(seconds > 1) ? 'seconds' : 'second'} left`
};