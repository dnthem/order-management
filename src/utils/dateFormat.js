// date format to mm/dd/yyyy
/**
 *  date format to mm/dd/yyyy
 * @param {string} date date to format, defaults to today
 * @returns {string} date in mm/dd/yyyy format
 */
export const dateFormat = (date) => {
    const d = date ? new Date(date) : new Date();
    return d.toLocaleDateString('en-US');
}

export const dateToISO = (date) => {
    const d = date ? new Date(date) : new Date();
    return d.toISOString().substring(0,10);
}

/**
 * Return the current time of the day: hh:mm
 * @returns {string} hh:mm
 */
export const getCurrentTime = () => {
    const today = new Date();
    return today.getHours() + ":" + today.getMinutes();
}

export const convertISOToUSA = (date) => {
    const dateAsNumber = Date.parse(date);
    const d = new Date(dateAsNumber + 7 * 60 * 60 * 1000);
    return d.toLocaleDateString('en-US');
}

export const convertUSAtoISO = (date) => {
    const dateAsNumber = Date.parse(date);
    const d = new Date(dateAsNumber - 7 * 60 * 60 * 1000);
    return d.toISOString().substring(0,10);
}

/**
 * Compare two dates and return true if date1 is greater than date2
 * @param {date} date1 
 * @param {date} date2 
 * @returns {boolean} true if date1 is greater than date2
 */
export const dateComparation = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getTime() > d2.getTime();
}