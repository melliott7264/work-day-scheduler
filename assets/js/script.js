// This is an application to create a simple daily planner  
// Define global variables
var startTime = 8; // beginning of work day 24 hour format
var endTime = 17;  // end of work day 24 hour format

// Define events array for localStorage  consists of event objects with properties dateTime and eventDesc  
var eventsArray = [];

// Add current day to top of page 
$("#currentDay").text(moment().format("dddd MMMM Do YYYY"));


// Start listEvents function 

var listEvents = function () {

// Define the event description variable 
var eventDescription = "";

// Define the current year, month, and day as a string for the event ID
var dateIdDay = moment().format("YYYYMMDD");

// Devine the variable for the hour class; past, present, future
var hourClass = "past";

// if the <ul> .list-group exists into which all the <li> (hour event blocks) are placed , remove it before rebuilding the list of hour event blocks
if ( $(".list-group") ) {
    $(".list-group").remove();
}

// Add back empty <ul> .list-group 
var listGroupEl = $("<ul>").addClass("list-group");
$(".container").append(listGroupEl);


// loop to populate days worth of hour event blocks
// if localStorage events exists then read all the events from that list and populate the day's blocks
// var eventsExists = loadEvents();  // true if the local events file exists and is loaded

for ( i=startTime; i<=endTime; i++) {
    //get the current time and compare to the time slot being built to assign class: past, present, future 
    var currentHour = parseInt(moment().format("HH"));

    // check if an event exists in eventsArray for this day and time.  if so, set eventDescription = eventArray.eventDesc  
    // if (eventsExists) {
        // loop through the entire array looking for a matching day and time
        // for ( i = 0; i < events.length; i++){
            // check dateIdDay against the first 8 chars of the event.dataTime string
        // }   
    // }
  
    if ( i < currentHour ) {
        hourClass = "past";
    } else if ( i > currentHour) {
        hourClass = "future";
    } else {
        hourClass = "present";
    }

    // Build two digit hour string for event ID 
    var hourString = ""
    // if i < 12 add a "0" in front of it
    if (i < 10 ) {
        hourString = "0" + i;
    } else {
        hourString = i;
    }

    var amString = "AM";
    // determine if AM/PM and set string accordingly
    if (i < 12 ) {
        amString = "AM";
    } else {
        amString = "PM";
    }

    var dateIdHour = dateIdDay + hourString;
    
    // if an event exists for this day and hour, use that event.  Otherwise create an empty event block
    
    // creating a <li> for each event hour
    var listItemEl = $("<li>").addClass("event-list-item list-unstyled row").attr("id", dateIdHour );
    listGroupEl.append(listItemEl);
    
    // creating <span>, <p>, and <button> elements for each event hour and appending to the <li>
    var listItemSpanEl = $("<span>").addClass("col-2 d-flex align-items-center justify-content-center time-block hour " + hourClass).text(hourString + ":00 " + amString);
    var listItemPEl = $("<p>").addClass("col-9 d-flex align-items-center mb-0 description " + hourClass).text(eventDescription);
    var listItemBtnEl = $("<button>").addClass("saveBtn col-1 " + hourClass).text("Save");
    listItemEl.append(listItemSpanEl, listItemPEl, listItemBtnEl);
}

return;

}; // End listEvent function

// loadEvents function to load events from localStorage
var loadEvents = function() {

    if (localStorage.getItem("events")) {
        events = JSON.parse(localStorage.getItem("events"));
        return true;
    } else {
        return false;
    }
};

// saveEvents function to save events array to localStorage events file
var saveEvents = function() {

    localStorage.setItem("events", JSON.stringify(eventsArray));

    return;
}

// editEvent function to edit event description
var editEvent = function () {

// need to identify the event that was clicked on and open an form field for that event's description


    return;
}

listEvents();


// Need to be able to add and edit blocks adding events
// Events must be saved to localStorage(events - an array of objects)
//

