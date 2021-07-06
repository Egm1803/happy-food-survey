

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

    //confirm logout
    function logoutConfirm(event) {
        event.preventDefault();
        let logout = window.confirm("Do you really want to leave?"); 
        if (logout) {location.href = '/api/logout'};
    }

    //confirm delete food on modal
    function deleteConfirm(event,self) {
        //get _id from html data to put it on delete button url string
        let id = self.getAttribute("data-foodItemId");
        let ele = document.getElementById("confirm-delete-btn")
        ele.href = `/api/foods/${id}/delete`;
        //set modal message
        let foodName = self.getAttribute("data-foodName");
        let msg = `Are you sure you want to delete ${foodName}? <br> All feedback history related to this food item will be lost.`      
        document.getElementById("modal-message").innerHTML= msg;
    }

    //check localstorage for active button, add class to active element,then clearStorage
    $(document).ready(function () {
        let activeEleIndex = localStorage.getItem('active');

        if(activeEleIndex) {
            $('.nav-button:nth-child('+activeEleIndex+')').addClass('active');
        }

        localStorage.clear();    
    });

    //onclick event listener for getting the index of clicked element , for highlighting the last selected item on layout
    $(document).ready(function() {
        $('.nav-button').click(function () {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            
            let activeEleIndex = $(this).index() + 1;
            localStorage.setItem('active', activeEleIndex);
        });
    });