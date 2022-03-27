// This is an application to create a simple daily planner  
// Define global variables
var startTime = 7; // beginning of work day 24 hour format
var endTime = 17;  // end of work day 24 hour format

// Define events array for localStorage  consists of event objects with properties dateTime and eventDesc  
var eventsArray = [];
// Need to define currentDate for use across functions and event handlers
var currentDate = moment().format("MM/DD/YYYY");

/* ******** Start listEvents function ********* */
// list out all the schedulable blocks in the current day 

var listEvents = function () {

// The dateFormat function returnd a date string in the format "yyyymmdd" provided a date in the format "MM/DD/YYYY". This is to be compatible with the datepicker format
// Moment.js requires date input in the form returned by dateFormat().  Otherwise, I get a deprecated error message.
dateIdDay = dateFormat(currentDate);

// set the date to display at the top of the page
 displayDate = moment(dateIdDay).format("dddd, MMMM Do YYYY");  // Date in the form "Sunday, March 27th 2022"
 $("#displayDate").text(displayDate);

// Get the date sting for the current date to use on initial load 
// var dateIdDay = moment().format("YYYYMMDD");



// *****************  Clear the Page ***********************
// if the <ul> .list-group exists into which all the <li> (hour event blocks) are placed , remove it before rebuilding the list of hour event blocks
if ($(".list-group")) {
    $(".list-group").remove();
}
// Add back empty <ul> .list-group 
var listGroupEl = $("<ul>").addClass("list-group");
$(".container").append(listGroupEl);
// **********************************************************

// ***************  Build a New Page ************************
// loop to populate days worth of hour event blocks
for ( i=startTime; i<=endTime; i++) {

    // Must initialize eventDescription for each event block
    var eventDescription = "";

    // Build two digit hour string for event ID 
    // if i < 10 add a "0" in front of it
    if (i < 10 ) {
        var hourString = "0" + i.toString();
    } else {
        var hourString = i.toString();
    }
    // dateIdHour used for eventId:  YYYYMMDDHH
    var dateIdHour = dateIdDay + hourString;

    // dateIdHourM used with moment.js to determine if past, present or future
    var dateIdHourM = dateIdDay + "T" + hourString;

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

    // check if saved events are present in localStorage.  if so, check for a matching eventId and set eventDescription = eventArray.eventDesc  
    if (loadEvents()) { 
    // loop through the entire array looking for a matching eventId
        for ( j = 0; j < eventsArray.length; j++){
            if (eventsArray[j].eventId === dateIdHour) {
                eventDescription = eventsArray[j].eventDesc;
            } 
        }   
    } else {
        console.log("events file failed to load");
        
    }

    // ***************** Creating the elements for each event hour block **************************
    // creating a <li> for each event hour
    var listItemEl = $("<li>").addClass("event-list-item list-unstyled row").attr("id", dateIdHour );
    listGroupEl.append(listItemEl);

    // creating <span>, <p>, and <button> elements for each event hour and appending to the <li>
    var listItemSpanEl = $("<span>").addClass("col-2 d-flex align-items-center justify-content-center time-block hour " + hourStatus(dateIdHourM)).text(displayHourString + ":00 " + amString);
    var listItemPEl = $("<p>").addClass("col-8 d-flex align-items-center mb-0 description " + hourStatus(dateIdHourM)).text(eventDescription);
    var listItemBtnClrEl = $("<button>").addClass("clearBtn col-1 " + hourStatus(dateIdHourM)).text("Clear");
    var listItemBtnEl = $("<button>").addClass("saveBtn col-1 " + hourStatus(dateIdHourM)).text("Save");
    listItemEl.append(listItemSpanEl, listItemPEl, listItemBtnClrEl, listItemBtnEl);
}  
// ********************** End of the For Loop to Build a New Page ***************************
return;
}; 
/* ************ End listEvent function ************ */

/* *********** Start loadEvents function to load events from localStorage ********** */
var loadEvents = function() {

    if (localStorage.getItem("events")) {
        eventsArray = JSON.parse(localStorage.getItem("events"));
        return true;
    } else {
        return false;
    }
};
/* **************  End loadEvent function ************** */

/* ************ Start saveEvents function to save events array to localStorage events file ************ */
var saveEvents = function(eventDesc, eventId) {
    if (!eventDesc || !eventId) {
        console.log("a valid eventId or eventDesc was not passed to the saveEvents function")
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
/* ************* End saveEvents function ************ */

/* ************ Start clearEvents function to save events array to localStorage events file ************ */
var clearEvents = function(eventId) {
    if (!eventId) {
        alert("Error! eventId not passed to clear event.");
    } else {
        if (confirm("Are you sure you want to delete this event?")){
            // find eventId in eventsArray then remove it
            for (i=0; i<eventsArray.length; i++) {
                if (eventId === eventsArray[i].eventId) {
                    eventsArray.splice(i,1);
                }
            }   
        } else {
            console.log("Event was not deleted by user action")
            return false;
        }   
    }
    localStorage.setItem("events", JSON.stringify(eventsArray));
    listEvents();    
    return true;
    
}
/* ************* End clearEvents function ************ */

/* ************ Start dateFormat function ************* */
// a function to take the string mm/dd/yyyy and turn it into the string yyyymmdd for the eventId
var dateFormat = function (inputDateString) {
    var monthArray = [];
    var dayArray = [];
    var yearArray = [];
    var revArray = [];
    var dateArray=inputDateString.split("");
    for (i=0; i<dateArray.length; i++) {
        if ( i < 2 ) {
            monthArray.push(dateArray[i]);
        } else if ( i >= 3 && i <= 4) {
            dayArray.push(dateArray[i]);
        } else if ( i > 5) {
            yearArray.push(dateArray[i]);
        }
    }
    revArray = yearArray.concat(monthArray,dayArray);
    var reverseDateString = revArray.join("");
    return reverseDateString;
};
/* ************ End dateFormat function ************** */

/* ******** Start hourStatus function ********** */
// this function determines whether the current hour block is in the past, present, or future
var hourStatus = function (dateIdHourM) {
       //get the current date and time and compare to the passed dateIdHour (yyyymmddhh) and assign a class: past, present, future
   if (moment().isBefore(dateIdHourM, "hour")){
    var  hourClass = "future";
   } else if (moment().isAfter(dateIdHourM, "hour")) {
        var hourClass = "past";
   } else {
       var hourClass = "present";
   }
       return hourClass;
}
/* ************* End hourStatus function *********** */

/* ********** Start updateScreen function *********** */
// updates the screen every minute to catch when the hour changes
var updateScreen = function () {
    var intervalId = setInterval( function() {
        console.log("The screen update timer ran");
        listEvents();
}, 60000);
};
/* ********** End updateScreen function ************ */

/* ************ Event Handler for Editing the Event Description ************* */
// need to identify the element that was clicked on and replace it with an input form  
$(".container").on("click", "p", function(){
    console.log("clicked on event description");
    // var eventDesc1 =$(this).text().trim();
    eventDesc1 = "This is placeholder text";
    console.log(this);
    console.log(eventDesc1);
    // var eventDescInput = $("<textarea>").addClass("form-control").val(eventDesc1);
    var eventDescInput = $("<input/>").attr({type: "text", id: "event-description", name: "event-description"}).val(eventDesc1);
    console.log(eventDescInput);
    $(this).replaceWith(eventDescInput);
    // make the text to be edited in focus
    eventDescInput.trigger("focus");
    // refresh the page
    listEvents();
});

// saves the editing changes when you click off the edited element 
$(".container").on("mouseleave", "textarea", function() {
    // get the edit box's current value/text
    var eventDesc2 = $(this).val().trim();
    // get the eventId
    var eventId2 = $(this).closest(".event-list-item").attr("id");
    // put the event block back the was it was with the new event text
    $(this).replaceWith = $("<p>").addClass("col-9 d-flex align-items-center mb-0 description " + hourStatus()).text(eventDesc2);
    // pass the eventId and new event description to the saveEvents function and refresh the page with the listEvents function
    saveEvents(eventDesc2, eventId2);
    listEvents();
    }); 
/* *********** End Event Description Editing  ************* */

/* ********** Start Event Handler for Event Clear Button *********** */   
// on click on the Clear button get the eventId and pass it to the clearEvents function
$(".container").on("click", ".clearBtn", function () {
    // get the eventId
    var eventId4=$(this).closest(".event-list-item").attr("id");
    // pass the eventId to be cleared to the clearEvents function
    clearEvents(eventId4);
    }); 

/* ********** Start Event Handler for Event Save Button *********** */   
// this is a redundant function to meet acceptance criteria.  Edits are saved when you click off the edited element 
$(".container").on("click", ".saveBtn", function () {
    var eventId3=$(this).closest(".event-list-item").attr("id");
    var eventDesc3 = $(this).siblings("p").text().trim();
    console.log("Save button was pressed");
    saveEvents(eventDesc3, eventId3);
    }); 

/* ************* Start datepicker Event Handler ************** */
// this calls the jquery UI datapicker to set the current date for the calendar
$("#datepicker").datepicker( {
    changeMonth: true,
    changeYear: true,
    dateFormat: "mm/dd/yy",
    defaultDate: new Date(),
    onSelect: function(date) {
        currentDate = date;
        listEvents();
    },
});
/* *************  End datepicker Event Handler ************* */

// Initial load of calendar for current day - runs the timer to update the screen every minute and loads the page for the current date
updateScreen();
listEvents();



