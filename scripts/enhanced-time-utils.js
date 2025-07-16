// Enhanced time utilities for Study Room Application
// Author: Shadi Sbaih

/**
 * Converts milliseconds to formatted time string (HH:MM:SS)
 * @param {number} ms - Time in milliseconds
 * @returns {string} Formatted time string
 */
export function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

/**
 * Converts time string (HH:MM:SS) to milliseconds
 * @param {string} timeString - Time in format HH:MM:SS
 * @returns {number} Time in milliseconds
 */
export function timeStringToMs(timeString) {
    if (!timeString || typeof timeString !== 'string') return 0;
    
    const parts = timeString.split(':');
    if (parts.length !== 3) return 0;
    
    const hours = parseInt(parts[0]) || 0;
    const minutes = parseInt(parts[1]) || 0;
    const seconds = parseInt(parts[2]) || 0;
    
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
}

/**
 * Validates time input values
 * @param {number} hours - Hours (0-23)
 * @param {number} minutes - Minutes (0-59) 
 * @param {number} seconds - Seconds (0-59)
 * @returns {boolean} True if valid, false otherwise
 */
export function validateTime(hours, minutes, seconds) {
    return (
        hours >= 0 && hours <= 23 &&
        minutes >= 0 && minutes <= 59 &&
        seconds >= 0 && seconds <= 59
    );
}

/**
 * Adds two time strings together
 * @param {string} time1 - First time string (HH:MM:SS)
 * @param {string} time2 - Second time string (HH:MM:SS)
 * @returns {string} Sum of times as formatted string
 */
export function addTimes(time1, time2) {
    const ms1 = timeStringToMs(time1);
    const ms2 = timeStringToMs(time2);
    return formatTime(ms1 + ms2);
}

/**
 * Gets a human-readable duration description
 * @param {string} timeString - Time in format HH:MM:SS
 * @returns {string} Human-readable description
 */
export function getTimeDescription(timeString) {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    
    if (hours === 0 && minutes === 0 && seconds === 0) {
        return "No study time yet";
    }
    
    const parts = [];
    if (hours > 0) {
        parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    }
    if (minutes > 0) {
        parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
    }
    if (seconds > 0 && hours === 0) {
        parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`);
    }
    
    return parts.join(', ');
}
