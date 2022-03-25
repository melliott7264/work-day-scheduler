// This is an application to create a simple daily planner  
// Define global variables
var startTime = 8; // beginning of work day 24 hour format
var endTime = 17;  // end of work day 24 hour format

// Define events array for localStorage  consists of event objects with properties dateTime and eventDesc  
var eventsArray = [];

// Add current day to top of page 
$("#currentDay").text(moment().format("dddd MMMM Do YYYY"));
// var currentDay = $("#datepicker").text().trim();
// console.log(currentDay);

/* ******** Start listEvents function ********* */
// list out all the schedulable blocks in the current day 
var listEvents = function (eventDesc, eventId) {

    console.log("This is the passed eventId and eventDesc " + eventId + " " + eventDesc);

// Define the current year, month, and day as a string for the event ID
var dateIdDay = moment().format("YYYYMMDD");

// if the <ul> .list-group exists into which all the <li> (hour event blocks) are placed , remove it before rebuilding the list of hour event blocks
if ( $(".list-group") ) {
    $(".list-group").remove();
}

// Add back empty <ul> .list-group 
var listGroupEl = $("<ul>").addClass("list-group");
$(".container").append(listGroupEl);


// loop to populate days worth of hour event blocks
for ( i=startTime; i<=endTime; i++) {
    //get the current time and compare to the time slot being built to assign class: past, present, future 
    var currentHour = parseInt(moment().format("HH"));
    var eventDescription = "";

    if ( i < currentHour ) {
       var  hourClass = "past";
    } else if ( i > currentHour) {
        var hourClass = "future";
    } else {
        var hourClass = "present";
    }

    // Build two digit hour string for event ID 
    // if i < 10 add a "0" in front of it
    if (i < 10 ) {
        var hourString = "0" + i.toString();
    } else {
        var hourString = i.toString();
    }
    
    var dateIdHour = dateIdDay + hourString;
    console.log("This is the calculated eventID " + dateIdHour);

    // determine if AM/PM and set string accordingly
    if (i < 12 ) {
        var amString = "AM";
    } else {
        var amString = "PM";
    }

    // create a 12 hour display hour string
    if (i > 12) {
        var displayHour = i - 12;
        var displayHourString = displayHour.toString();
    } else {
        var displayHourString = i.toString();
    }

  // if an eventId and eventDesc have been passed to this function used those values.  Otherwise check for saved events.  If none, create an empty event block
  if (eventId && eventDesc) {
    if (eventId === dateIdHour){
    eventDescription = eventDesc;
    } else {
        console.log("passed eventId and dataIdHour do not match ");
    }
} else {
       // check if saved events are present in localStorage.  if so, check for a matching eventId and set eventDescription = eventArray.eventDesc  
        if (loadEvents()) { 
        // loop through the entire array looking for a matching eventId
            for ( j = 0; j < eventsArray.length; j++){
                if (eventsArray[j].eventId === dateIdHour) {
                    eventDescription = eventsArray[j].eventDesc;
                    console.log(dateIdHour + " " + eventsArray[j].eventId + " " + eventsArray[j].eventDesc);
                } else {
                    console.log("there is not an event for this date/time in the database");
                }
                }   
        } else {
            console.log("events file failed to load");
        }
}

    // creating a <li> for each event hour
    var listItemEl = $("<li>").addClass("event-list-item list-unstyled row").attr("id", dateIdHour );
    listGroupEl.append(listItemEl);
    
    // creating <span>, <p>, and <button> elements for each event hour and appending to the <li>
    var listItemSpanEl = $("<span>").addClass("col-2 d-flex align-items-center justify-content-center time-block hour " + hourClass).text(displayHourString + ":00 " + amString);
    var listItemPEl = $("<p>").addClass("col-9 d-flex align-items-center mb-0 description " + hourClass).text(eventDescription);
    var listItemBtnEl = $("<button>").addClass("saveBtn col-1 " + hourClass).text("Save");
    listItemEl.append(listItemSpanEl, listItemPEl, listItemBtnEl);
}

return;

}; 

/* ************ End listEvent function ************ */

/* *********** Start loadEvents function to load events from localStorage ********** */
var loadEvents = function() {

    if (localStorage.getItem("events")) {
        eventsArray = JSON.parse(localStorage.getItem("events"));
        console.log(eventsArray);
        return true;
    } else {
        return false;
    }
};

/* **************  End loadEvent function ************** */

/* ************ Start saveEvents function to save events array to localStorage events file ************ */
var saveEvents = function(eventDesc, eventId) {
    if (!eventDesc || !eventId) {
        return false;
    } else {
        eventsArray.push({
            eventDesc: eventDesc,
            eventId: eventId
    });
    }

    localStorage.setItem("events", JSON.stringify(eventsArray));

    return true;
}

// need to identify the element that was clicked on and replace it with an input form  
$(".container").on("click", "p", function(){
    var eventDesc =$(this).text().trim();
    var eventDescInput = $("<textarea>").addClass("form-control").val(eventDesc);
    $(this).replaceWith(eventDescInput);
    // make the text to be edited in focus
    eventDescInput.trigger("focus");
  });
  
  $(".container").on("change", "textarea", function() {
    //get the edit box's current value/text
    var eventDesc = $(this).val().trim();
    var eventId = $(this).closest(".event-list-item").attr("id");

    // pass the updated event description along with the eventId back to listEvents to displa
    listEvents(eventDesc, eventId);
  });
  
$(".container").on("click", "button", function () {
    var eventId=$(this).closest(".event-list-item").attr("id");
    var eventDesc = $(this).siblings("p").text().trim();
    saveEvents(eventDesc, eventId);
    });

$(function () {
    $("#datepicker").datepicker();
});

// run listEvents function to load up the current day's page

listEvents();



