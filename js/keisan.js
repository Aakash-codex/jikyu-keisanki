// ============================================
// Wage Calculator - Beginner-Friendly Code
// ============================================

// ============================================
// Function 1: Automatically format time input field
// ============================================
// This function automatically converts user input
// to "HH:MM" format (example: 09:00)
function formatTimeInput(inputElement) {
    // Save current cursor position
    let currentCursorPosition = inputElement.selectionStart;
    
    // Get current value from input field
    let currentValue = inputElement.value;
    
    // Remove all non-digit characters (like colon) and keep only numbers
    let onlyNumbers = currentValue.replace(/[^\d]/g, '');
    
    // If more than 4 digits are entered, use only the first 4 digits
    if (onlyNumbers.length > 4) {
        onlyNumbers = onlyNumbers.substring(0, 4);
    }
    
    // Convert time to "HH:MM" format
    let formattedTime;
    if (onlyNumbers.length >= 2) {
        // If 2 or more digits: first 2 digits are hours, next 2 are minutes
        let hours = onlyNumbers.substring(0, 2);      // First 2 digits (hours)
        let minutes = onlyNumbers.substring(2, 4);    // Next 2 digits (minutes)
        formattedTime = hours + ':' + minutes;
    } else {
        // If less than 2 digits, just show the numbers as is
        formattedTime = onlyNumbers;
    }
    
    // Update the input field value
    inputElement.value = formattedTime;
    
    // Return cursor to appropriate position
    let newCursorPosition;
    if (onlyNumbers.length === 0) {
        // If nothing is entered, place cursor at the beginning
        newCursorPosition = 0;
    } else if (onlyNumbers.length <= 2) {
        // If only hours part is entered
        newCursorPosition = onlyNumbers.length;
    } else {
        // If minutes are also entered (add +1 for the colon)
        newCursorPosition = Math.min(onlyNumbers.length + 1, formattedTime.length);
    }
    
    // Set cursor position
    inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
}

// ============================================
// Function 2: Execute when page is loaded
// ============================================
// This function sets up event listeners for time input fields
// after the page has fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get start time and end time input fields
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');
    
    // Function to set up time input field
    function setupTimeInput(inputElement) {
        // Execute when user types a character
        inputElement.addEventListener('input', function() {
            formatTimeInput(this);
        });
        
        // Execute when user presses a key
        inputElement.addEventListener('keydown', function(event) {
            // If Backspace or Delete key is pressed
            if (event.key === 'Backspace' || event.key === 'Delete') {
                // Wait a bit then execute formatting (after deletion is complete)
                setTimeout(function() {
                    formatTimeInput(this);
                }.bind(this), 0);
            }
        });
        
        // Execute when user pastes content
        inputElement.addEventListener('paste', function() {
            // Wait a bit then execute formatting (after paste is complete)
            setTimeout(function() {
                formatTimeInput(this);
            }.bind(this), 0);
        });
    }
    
    // Set up start time input field
    if (startTimeInput) {
        setupTimeInput(startTimeInput);
    }
    
    // Set up end time input field
    if (endTimeInput) {
        setupTimeInput(endTimeInput);
    }
});

// ============================================
// Function 3: Convert time string (HH:MM) to decimal hours
// ============================================
// Example: "09:30" → 9.5 hours (9 hours 30 minutes = 9.5 hours)
function timeToDecimal(timeString) {
    // Split by colon to get hours and minutes
    let timeParts = timeString.split(':');
    
    // If there's no colon, it's invalid
    if (timeParts.length !== 2) {
        return NaN; // NaN = "Not a Number"
    }
    
    // Convert hours part to number (example: "09" → 9)
    let hours = parseInt(timeParts[0], 10);
    
    // Convert minutes part to number (example: "30" → 30)
    let minutes = parseInt(timeParts[1], 10);
    
    // If hours are outside 0-23 range, or minutes outside 0-59 range, it's invalid
    if (isNaN(hours) || isNaN(minutes) || 
        hours < 0 || hours > 23 || 
        minutes < 0 || minutes > 59) {
        return NaN;
    }
    
    // Calculate decimal hours: hours + (minutes ÷ 60)
    // Example: 9 hours 30 minutes = 9 + (30 ÷ 60) = 9 + 0.5 = 9.5 hours
    let decimalHours = hours + (minutes / 60);
    
    return decimalHours;
}

// ============================================
// Function 4: Check if time format is correct
// ============================================
// Check if it's in 24-hour format (00:00 to 23:59)
function validateTimeFormat(timeString) {
    // Regular expression pattern: HH:MM format (00:00 to 23:59)
    // [0-1][0-9] = 00-19
    // 2[0-3] = 20-23
    // [0-5][0-9] = 00-59 (minutes)
    let timePattern = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    
    // Test if it matches the pattern
    let isValid = timePattern.test(timeString);
    
    return isValid;
}

// ============================================
// Function 5: Calculate wage (main function)
// ============================================
function calculateWage() {
    // Step 1: Get values from input fields
    let baseWageInput = document.getElementById('baseWage').value;
    let startTimeInput = document.getElementById('startTime').value.trim();
    let endTimeInput = document.getElementById('endTime').value.trim();
    
    // Step 2: Convert hourly wage to number
    let baseWage = parseFloat(baseWageInput);
    
    // Step 3: Check if time format is correct
    let isStartTimeValid = validateTimeFormat(startTimeInput);
    let isEndTimeValid = validateTimeFormat(endTimeInput);
    
    if (!isStartTimeValid || !isEndTimeValid) {
        alert("時間は24時間形式（HH:MM）で入力してください。例: 09:00, 17:30");
        return; // Stop calculation if there's an error
    }
    
    // Step 4: Check if hourly wage is correct
    if (isNaN(baseWage) || baseWage <= 0) {
        alert("正しい時給を入力してください");
        return; // Stop calculation if there's an error
    }
    
    // Step 5: Convert time strings to decimal hours
    let startTimeDecimal = timeToDecimal(startTimeInput);
    let endTimeDecimal = timeToDecimal(endTimeInput);
    
    if (isNaN(startTimeDecimal) || isNaN(endTimeDecimal)) {
        alert("正しい時間を入力してください");
        return; // Stop calculation if there's an error
    }
    
    // Step 6: Calculate total working hours
    let totalHours;
    if (endTimeDecimal >= startTimeDecimal) {
        // Normal case: end time is after start time
        // Example: 09:00 to 17:00 = 8 hours
        totalHours = endTimeDecimal - startTimeDecimal;
    } else {
        // Night shift case: end time is before start time (spans to next day)
        // Example: 22:00 to 06:00 = (24 - 22) + 6 = 8 hours
        totalHours = (24 - startTimeDecimal) + endTimeDecimal;
    }
    
    // Step 7: Calculate night hours (22:00 to 05:00)
    let nightHours = 0;
    let timeStep = 0.25; // Check in 15-minute increments (0.25 hours = 15 minutes)
    
    // Check every 15 minutes if that time is in the night shift period
    for (let currentTime = 0; currentTime < totalHours; currentTime += timeStep) {
        // Calculate current time (in 24-hour format)
        let currentHour = (startTimeDecimal + currentTime) % 24;
        
        // If it's 22:00 or later, or before 05:00, it's night hours
        if (currentHour >= 22 || currentHour < 5) {
            nightHours = nightHours + timeStep;
        }
    }
    
    // Step 8: Calculate normal hours
    let normalHours = totalHours - nightHours;
    
    // Step 9: Calculate wages
    // Normal hours wage = normal hours × hourly wage
    let normalPay = normalHours * baseWage;
    
    // Night hours wage = night hours × hourly wage × 1.25 (25% bonus)
    let nightPay = nightHours * baseWage * 1.25;
    
    // Total wage = normal hours wage + night hours wage
    let totalPay = normalPay + nightPay;
    
    // Step 10: Display result on screen
    let resultElement = document.getElementById('result');
    resultElement.innerHTML = 
        '通常時間: ' + normalHours.toFixed(2) + ' 時間<br>' +
        '深夜時間: ' + nightHours.toFixed(2) + ' 時間<br>' +
        '合計給料: ¥' + Math.round(totalPay) + '<br>' +
        '<strong>お疲れ様でした！</strong>';
}
