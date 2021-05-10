//Set min and max date: 6 months prior - today
function setMaxDate() {
    var today = new Date();
    today.setHours(23,59,59,0); // next midnight
    
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
    
    var minDate = new Date();
    var dd = minDate.getDate();
    var mm = minDate.getMonth()-4; //January is 0!
    var yyyy = minDate.getFullYear();
    //if its last year, decrement year and add 13 to month
    if (Math.sign(mm) === -1) {
        yyyy -= 1;
        mm += 13;
    };
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

    function logoutConfirm(event) {
        event.preventDefault();
        let logout = window.confirm("Do you really want to leave?"); 
        if (logout) {location.href = '/api/logout'};
    }
    //check localstorage for active button, add class to active element,then clearStorage
    $(document).ready(function () {
        let activeEleIndex = localStorage.getItem('active');

        if(activeEleIndex) {
            $('.nav-button:nth-child('+activeEleIndex+')').addClass('active');
        }

        localStorage.clear();    
    });

    //onclick event listener for getting the index of clicked element
    $(document).ready(function() {
        $('.nav-button').click(function () {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            
            let activeEleIndex = $(this).index() + 1;
            localStorage.setItem('active', activeEleIndex);
        });
    });