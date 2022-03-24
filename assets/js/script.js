// This is an application to create a simple daily planner  
// Define global variables
var startTime = 8; // beginning of work day 24 hour format
var endTime = 17;  // end of work day 24 hour format


// Add current day to top of page 
$("#currentDay").text(moment().format("dddd MMMM Do YYYY"));

// Need to generate 1 hour blocks for business hours  8AM - 5PM  - Should be able to define business hours
// create the li .list-item and append it to ul .list-group
var dateIdDay = moment().format("YYYYMMDD");

var hourClass = "past";

// if <ul> .list-group exists, remove it before rebuilding days list
if ( $(".list-group") ) {
    $(".list-group").remove();
}

// Add back empty <ul> .list-group 
var listGroupEl = $("<ul>").addClass("list-group");

$(".container").append(listGroupEl);


// loop to populate days worth of hour event blocks
// if localStorage events exists then read all the events from that list and populate the day's blocks

for ( i=startTime; i<=endTime; i++) {
    //get the current time and compare to the time slot being built to assign class: past, present, future 
    var currentHour = parseInt(moment().format("HH"));

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
    var listItemPEl = $("<p>").addClass("col-9 d-flex align-items-center mb-0 description " + hourClass).text("This is event placeholder text");
    var listItemBtnEl = $("<button>").addClass("saveBtn col-1 " + hourClass).text("Save");
    listItemEl.append(listItemSpanEl, listItemPEl, listItemBtnEl);
}


// Need to be able to add and edit blocks adding events
// Events must be saved to localStorage(events - an array of objects)
//

