// This is an application to create a simple daily planner  
// Define global variables
var startTime = 8; // beginning of work day 24 hour format
var endTime = 17;  // end of work day 24 hour format

// Define events array for localStorage  consists of event objects with properties dateTime and eventDesc  
var eventsArray = [];
// Need to define currentDate for use across functions and event handlers
var currentDate = moment().format("MM/DD/YYYY");


// Add current day to top of page 
// $("#currentDay").text(moment().format("dddd MMMM Do YYYY"));

/* ******** Start listEvents function ********* */
// list out all the schedulable blocks in the current day 
// var listEvents = function (eventDesc, eventId) {
var listEvents = function () {

 displayDate = moment(currentDate).format("dddd, MMMM Do YYYY");
 $("#displayDate").text(displayDate);

//eventDesc and eventId are passed by the event handlers when editing events and by the saveEvent function.  Otherwise, they are ignored.

// Get the date sting for the current date to use on initial load 
var dateIdDay = moment().format("YYYYMMDD");

// If the currentDate set by the datepicker exists,  use that for listing the events.  The dateFormat function return a date string in the format "yyyymmdd"
if (currentDate) {
    dateIdDay = dateFormat(currentDate);
}

// if the <ul> .list-group exists into which all the <li> (hour event blocks) are placed , remove it before rebuilding the list of hour event blocks
if ($(".list-group")) {
    $(".list-group").remove();
}

// Add back empty <ul> .list-group 
var listGroupEl = $("<ul>").addClass("list-group");
$(".container").append(listGroupEl);


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

    // console.log("This is the calculated eventID " + dateIdHour);

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
//   if (eventId && eventDesc) {
//     if (eventId === dateIdHour){
//         eventDescription = eventDesc;
//     } else {
//         console.log("a matching eventID was not passed, event description will be blank");
//     }
//   } else {
       // check if saved events are present in localStorage.  if so, check for a matching eventId and set eventDescription = eventArray.eventDesc  
        if (loadEvents()) { 
        // loop through the entire array looking for a matching eventId
            for ( j = 0; j < eventsArray.length; j++){
                if (eventsArray[j].eventId === dateIdHour) {
                    eventDescription = eventsArray[j].eventDesc;
                    console.log(eventDescription);
                } else {
                    console.log("there is not an event for this date/time in the database, event description will be blank");
                }
            }   
        } else {
            console.log("events file failed to load, event description will be blank");
           
        }
    // }

    // Creating the elements for each event hour block

    // creating a <li> for each event hour
    var listItemEl = $("<li>").addClass("event-list-item list-unstyled row").attr("id", dateIdHour );
    listGroupEl.append(listItemEl);

    // creating <span>, <p>, and <button> elements for each event hour and appending to the <li>
    var listItemSpanEl = $("<span>").addClass("col-2 d-flex align-items-center justify-content-center time-block hour " + hourStatus(dateIdHourM)).text(displayHourString + ":00 " + amString);
    var listItemPEl = $("<p>").addClass("col-9 d-flex align-items-center mb-0 description " + hourStatus(dateIdHourM)).text(eventDescription);
    var listItemBtnEl = $("<button>").addClass("saveBtn col-1 " + hourStatus(dateIdHourM)).text("Save");
    listItemEl.append(listItemSpanEl, listItemPEl, listItemBtnEl);
}
return;
}; 
/* ************ End listEvent function ************ */

/* *********** Start loadEvents function to load events from localStorage ********** */
var loadEvents = function() {

    if (localStorage.getItem("events")) {
        eventsArray = JSON.parse(localStorage.getItem("events"));
        console.log("loaded local database file");
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
/* ************* End saveEvents function ************ */

/* ************ Start dateFormat function ************* */
// a function to take the string mm/dd/yyyy and turn it into the string yyyymmdd for the eventId
var dateFormat = function (inputDateString) {
    var monthArray = [];
    var dayArray = [];
    var yearArray = [];
    var revArray = [];
    var dateArray=inputDateString.split("");
    console.log(dateArray);
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
    console.log(reverseDateString);
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
    var intervalId = setInterval(listEvents(), 60000);
}
/* ********** End updateScreen function ************ */

/* ************ Event Handler for Editing the Event Description ************* */
// need to identify the element that was clicked on and replace it with an input form  
// $(function() {
    $(".container").on("click", "p", function(){
        var eventDesc1 =$(this).text().trim();
        var eventDescInput = $("<textarea>").addClass("form-control").val(eventDesc1);
        $(this).replaceWith(eventDescInput);
        // make the text to be edited in focus
        eventDescInput.trigger("focus");
        // var eventId1 = $(this).closest(".event-list-item").attr("id");
        console.log("clicked on p -- " + " eventDesc1 " + eventDesc1 + "  eventId1 " + eventId1);
        // listEvents(eventDesc1, eventId1);
        listEvents();
    });
// }):

// $(function(){
    // saves the editing changes when you click off the edited element 
  $(".container").on("mouseleave", "textarea", function() {
    //get the edit box's current value/text
    var eventDesc2 = $(this).val().trim();
    var eventId2 = $(this).closest(".event-list-item").attr("id");
    $(this).replaceWith=$("<p>").addClass("col-9 d-flex align-items-center mb-0 description " + hourStatus()).text(eventDesc2);
    // pass the updated event description along with the eventId back to listEvents to display
    console.log("mouseleave p -- " + eventDesc2 + "  " + eventId2);
    saveEvents(eventDesc2, eventId2);
    // listEvents(eventDesc2, eventId2);
    listEvents();
    // listEvents();
  }); 
// }); 
/* *********** End Event Description Editing  ************* */

/* ********** Start Event Handler for Event Save Button *********** */   
// this is a redundant function to meet acceptance criteria.  Edits are saved when you click off the edited element 
// $(function(){
   $(".container").on("click", "button", function () {
    var eventId3=$(this).closest(".event-list-item").attr("id");
    var eventDesc3 = $(this).siblings("p").text().trim();
    saveEvents(eventDesc3, eventId3);
    }); 
// });

/* ************* Start datepicker Event Handler ************** */
// $(function()  {
//     $("#datepicker").datepicker().datepicker("setDate", new Date ());
//     currentDate = $("#datepicker").datepicker("getDate");
//     listEvents();
// });    
// $(function(){
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
// });

/* *************  End datepicker Event Handler ************* */

// Initial load of calendar for current day
updateScreen();
listEvents();



