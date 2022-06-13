export default function getJamStatus(startTime, endTime) {
    let now = new Date().toISOString();

    // Upcoming
    if ((startTime && new Date(startTime).toISOString()) > now) return -1;

    // Ongoing
    if ((startTime && new Date(startTime).toISOString()) <= now && now < (endTime && new Date(endTime).toISOString())) return 0;

    // Over
    return 1;
}
