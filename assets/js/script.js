// This is an application to create a simple daily planner  
// Define global variables
var startTime = 8; // beginning of work day
var endTime = 17;  // end of work day


// Add current day to top of page 
$("#currentDay").text(moment().format("dddd MMMM Do YYYY"));


// Need to generate 1 hour blocks for business hours  8AM - 5PM  - Should be able to define business hours
// Blocks are divided into three columns for time, event, and save button
// Must retrieve and display blocks from localStorage(events)for the current day 
// Blocks must be audited and color coded; red(current hour), gray(past hours), and green(future hours)
// Need to be able to add and edit blocks adding events
// Events must be saved to localStorage(events - an array of objects)
//

