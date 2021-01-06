//Set min and max date: 6 months prior - today
function setMaxDate() {
    console.log('WORKED max');
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    //add 0 to single digit numbers
    if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
    today = yyyy+'-'+mm+'-'+dd;
    document.getElementById("date").setAttribute("max", today);
    };

function setMinDate() {
    console.log('WORKED min');
    var minDate = new Date();
    var dd = minDate.getDate();
    var mm = minDate.getMonth()-4; //January is 0!
    var yyyy = minDate.getFullYear();
    //add 0 to single digit numbers
    if(dd<10){
            dd='0'+dd
        } 
        if(mm<10){
            mm='0'+mm
        } 
    minDate = yyyy+'-'+mm+'-'+dd;
    document.getElementById("date").setAttribute("min", minDate); 
    }; 

