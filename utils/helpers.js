module.exports = {

    format_date: date => {
        const rightNow = new Date(Date.now());
        const postTime = new Date(date);
        const Difference_In_Time = rightNow.getTime() - postTime.getTime();
        const Difference_In_Hours = Difference_In_Time / (1000 * 3600);
        const Difference_In_Minutes = Difference_In_Time / (1000 * 60);

        if (Difference_In_Hours < 1) return `${Difference_In_Minutes.toFixed(0)}m old`;
        if (Difference_In_Hours < 48) return `${Difference_In_Hours.toFixed(0)}h old`;

        return `on ${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(date).getFullYear()}`;
    },

    format_plural: (word, num) => {
        if (num > 1 || num === 0) return word + 's';
        return word;
    },

    ifEquals: (arg1, arg2) => {
        return arg1 == arg2;
    },

    ifTruncated: (length) => {
        if (parseInt(length) > 225) return true;
    }
}