/**
 * Check if the jam is upcoming, ongoing or over.
 * @param {string} startTime When the jam starts
 * @param {string} endTime When the jam finishes
 * @returns {-1 | 0 | 1} 1 if the jam is over, 0 if it is ongoing, -1 if it is upcoming.
 */
export default function getJamStatus(startTime, endTime) {
    const now = new Date().toISOString();

    // Upcoming
    if ((startTime && new Date(startTime).toISOString()) > now) return -1;

    // Ongoing
    if ((startTime && new Date(startTime).toISOString()) <= now && now < (endTime && new Date(endTime).toISOString())) return 0;

    // Over
    return 1;
}
