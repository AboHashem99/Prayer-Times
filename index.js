let container1=document.getElementById("date");
let container2=document.getElementsByClassName("grid-container");
container2 = container2[0];
let container3=document.getElementById("wrapper");
let container4=document.getElementsByClassName("dropdown");
container4 = container4[0];
const dropdownContent = document.querySelector(".dropdown-content")
let place = document.getElementsByClassName("grid-item2");
let city = document.getElementsByClassName("dropbtn");
let choices = document.getElementsByClassName("content");
let footer = document.getElementById("footer");
let location1 = document.getElementById("location");
let gridItem1 = document.getElementsByClassName("grid-item1");
const flex_container = document.querySelector(".flex-container");
const nextPrayer = document.getElementById("nextPrayer");
const timeLeft = document.getElementById("timeLeft");
let latitude;
let longitude;
let prayerTimes = [];
let dayCount = getDay();
let month = Number(getMonth());
let time = document.getElementById("time");
let totalDate = new Date();
let seconds = totalDate.getSeconds();
let minutes = totalDate.getMinutes();
let hours = totalDate.getHours();
let amvalue = "";

function appearGear(){
    container1.style.display="none";
    container2.style.display="none";
    flex_container.style.display="none";
    container3.style.display="inline-block";
    // container3.style.textAlign="center";
    // container4.style.display="none";
    footer.style.display="none";
}
function deleteGear(){
    container1.style.display="flex";
    container1.style.textAlign="center";
    container2.style.display="grid";
    flex_container.style.display="flex";
    container3.style.display="none";
    // container4.style.display="inline-block";
    footer.style.display="flex";
}
function getDay(){
    let today = new Date();
    let day = today.getDate().toString();
    if (day.length ===1) {
        day = "0"+day;
    }
    return day;
}
function getMonth(){
    let today = new Date();
    let month = today.getMonth()+1;
    month=month.toString();
    if (month.length ===1) {
        month = "0"+month;
    }
    return month;
}
function getYear(){
    let today = new Date();
    let year = today.getFullYear();
    return year;
}
function getToday(){
    let day = getDay();
    let month = getMonth();
    let year = getYear();
    let today = `${day}-${month}-${year}`;
    return today;
}
function getGDate() {
    axios.get(`https://api.aladhan.com/v1/calendarByCity?city=Makkah&country=SA&method=4&month=${getMonth()}&year=${getYear}`)
    .then(function(response){
        let today = getToday();
        let arr =[];
        // console.log(response.data.data[3].timings.Fajr)
        for (let i = 0; i < response.data.data.length; i++) {
            arr.push(response.data.data[i].date.gregorian.date)   
        }
        for (let i = 0; i < arr.length; i++) {
            if (today === arr[i]) {
                body.innerText += response.data.data[i].date.gregorian.date;
            }   
        }
    });
}
function getHDate() {
    axios.get(`https://api.aladhan.com/v1/calendarByCity?city=Makkah&country=SA&method=4&month=${getMonth()}&year=${getYear}`)
    .then(function(response){
        let today = getToday();
        let arr =[];
        // console.log(response.data.data[3].timings)
        for (let i = 0; i < response.data.data.length; i++) {
            arr.push(response.data.data[i].date.gregorian.date)   
        }
        for (let i = 0; i < arr.length; i++) {
            if (today === arr[i]) {
                body.innerText += response.data.data[i].date.hijri.date;
            }   
        }
    });
}

// to remove (+3) from timings
function correctTimings(arr) {
    for (let i = 0; i < arr.length; i++) {
        arr[i]=arr[i].substring(0,arr[i].length-6);
    }
}
function setInitialTime(){
    setHours();
    if (hours ===0) {
        timeNow = `12:${minTwoDigits(minutes)}:${minTwoDigits(seconds)} ${amvalue}`;
    }
    else if (hours >12){
        timeNow = `${(hours-12)}:${minTwoDigits(minutes)}:${minTwoDigits(seconds)} ${amvalue}`;
    }
    else timeNow = `${(hours)}:${minTwoDigits(minutes)}:${minTwoDigits(seconds)} ${amvalue}`;
    time.innerText =timeNow;
}
function incrementSeconds() {
    seconds++;
    if (seconds === 60) {
        minutes++;
        if (minutes === 60) {
            hours++;
            setHours();
            minutes = 0;
        }
        seconds = 0
    }
    if (hours ===0) {
        timeNow = `12:${minTwoDigits(minutes)}:${minTwoDigits(seconds)} ${amvalue}`;
    }
    else if (hours >12){
        timeNow = `${(hours-12)}:${minTwoDigits(minutes)}:${minTwoDigits(seconds)} ${amvalue}`;
    }
    else timeNow = `${(hours)}:${minTwoDigits(minutes)}:${minTwoDigits(seconds)} ${amvalue}`;
    time.innerText =timeNow;
}
function setHours(){
    (hours > 11) ? amvalue = "PM" : amvalue = "AM";
    // if (hours > 12) {
    //     hours -=12;
    // }
    if (hours > 23 && amvalue === "PM") {
        hours = 0;
        amvalue = "AM";
    }
}
function minTwoDigits(n) {
    return (n < 10 ? '0' : '') + n;
}

function setDayBasedOnMonth(num){
    let days = [31,28,31,30,31,30,31,31,30,31,30,31];
    for (let i = 0; i < days.length; i++) {
        if (i+1 === num) {
            return days[i]
        }
    }
}
function monthInLetters(date){
    let arr = date.split("-");
    let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    let month = Number(arr[1]);
    for (let i = 0; i < months.length; i++) {
        if (i+1 === month) {
            return `${Number(arr[0])} ${months[i]}`
        }
    }
}

// time for next prayer
function getNextPrayer(){
    for (let i = 0; i < prayerTimes.length; i++) {
        gridItem1[i].style.background = "";
        place[i].style.background = "";
        gridItem1[i].style.borderColor  = "";
        gridItem1[i].style.borderWidth  = "";
        place[i].style.borderWidth = "";
        place[i].style.borderColor  = "";
    }

    let currentTotal = (hours*60) + minutes;
    for (let i = 0; i < prayerTimes.length; i++) {
        let total = 0;
        let arr2 = prayerTimes[i].split(":");

        total = (Number(arr2[0])*60) + Number(arr2[1]);

        total = total - currentTotal;

        if (total > 0) {
            let arr3 = [i,total];
            nextPrayer.innerText = `${gridItem1[i].innerText} Prayer:`;
            timeLeft.innerText = `${timeConvert(arr3[1])}`;
            gridItem1[i].style.background = "black";
            gridItem1[i].style.borderColor  = "#d3455a";
            gridItem1[i].style.borderWidth  = "3px";
            place[i].style.background = "black";
            place[i].style.borderColor  = "#d3455a";
            place[i].style.borderWidth  = "3px";

            return arr3;
        }
    }
}
function timeConvert(n) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + " hours & " + rminutes + " minutes remaining";
}


function setPrayer(place,city,dayCount,month){
    appearGear();
    axios.get(`https://api.aladhan.com/v1/calendarByCity?city=${city}&country=SA&method=4&month=${month}&year=${getYear()}`)
    .then(function(response){
        let dayHTML = document.getElementById("day");
        let gregorian = document.getElementById("gregorian");
        let hijri = document.getElementById("hijri");
        let today = getToday();
        prayerTimes = [];
        let arr =[];
        let date = "";
        let day = "";
        // console.log(response.data.data[3].date.gregorian.weekday.en)
        for (let i = 0; i < response.data.data.length; i++) {
            arr.push(response.data.data[i].date.gregorian.date)   
        }
        date = response.data.data[dayCount-1];
        gdate = date.date.gregorian.date;
        gregorian.innerText = monthInLetters(gdate);
        // hdate = date.date.hijri.date;
        // hijri.innerText = hdate;
        day = date.date.gregorian.weekday.en;
        dayHTML.innerText = day.substring(0,3).toUpperCase();
        // console.log(day);

        place.innerText += date.timings.Fajr;
        prayerTimes.push(date.timings.Fajr);
        prayerTimes.push(date.timings.Sunrise);
        prayerTimes.push(date.timings.Dhuhr);
        prayerTimes.push(date.timings.Asr);
        prayerTimes.push(date.timings.Maghrib);
        prayerTimes.push(date.timings.Isha);
        correctTimings(prayerTimes);
        getNextPrayer(prayerTimes);
        setInterval(getNextPrayer, 1000);
        // console.log(prayerTimes)
        for (let i = 0; i < prayerTimes.length; i++) { 
            place[i].innerText = setTimeAmPm( prayerTimes[i] );
        }
        deleteGear();
    })
    .catch(function(e){
        console.log(e);
    })
}

// pm am function
function setTimeAmPm(time){
    let arr2 = time.split(":");

    if (arr2[0]>11) {
        let temp = Number(arr2[0]);
        temp = temp.toString();
        if (arr2[0]>12) {
            temp = Number(arr2[0]) - 12;
            temp = temp.toString();
        }
        return `${temp}:${arr2[1]} PM`    
    }
    return `${Number(arr2[0])}:${arr2[1]} AM`
       
}

// prayer based on location
function userLocation(position){
    dayCount=getDay();
    month = Number(getMonth());
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    setPrayerBasedLocation(place, dayCount,month,longitude,latitude);
}
function errorCallback(error){
    console.log(error);
}
function setPrayerBasedLocation(place,dayCount,month,longitude,latitude){
    appearGear();
    axios.get(`https://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=4&month=${month}&year=${getYear()}`)
    .then(function(response){
        let dayHTML = document.getElementById("day");
        let gregorian = document.getElementById("gregorian");
        let hijri = document.getElementById("hijri");
        let today = getToday();
        prayerTimes = [];
        let arr =[];
        let date = "";
        let day = "";
        // console.log(response.data.data[3].date.gregorian.weekday.en);
        for (let i = 0; i < response.data.data.length; i++) {
            arr.push(response.data.data[i].date.gregorian.date)   
        }
        date = response.data.data[dayCount-1];
        gdate = date.date.gregorian.date;
        gregorian.innerText = monthInLetters(gdate);
        // hdate = date.date.hijri.date;
        // hijri.innerText = hdate;
        day = date.date.gregorian.weekday.en;
        dayHTML.innerText = day.substring(0,3).toUpperCase();
        // console.log(day);

        place.innerText += date.timings.Fajr;
        prayerTimes.push(date.timings.Fajr);
        prayerTimes.push(date.timings.Sunrise);
        prayerTimes.push(date.timings.Dhuhr);
        prayerTimes.push(date.timings.Asr);
        prayerTimes.push(date.timings.Maghrib);
        prayerTimes.push(date.timings.Isha);
        correctTimings(prayerTimes);
        getNextPrayer(prayerTimes);
        setInterval(getNextPrayer, 1000);
        for (let i = 0; i < prayerTimes.length; i++) { 
            place[i].innerText = setTimeAmPm( prayerTimes[i] );
        }
        deleteGear();
        for (let i = 1; i < choices.length; i++) {
            choices[i].style.background = "";     // مدري كيف زبط
        }
        location1.style.background = "#8e013c";
        city[0].innerHTML = location1.innerHTML;
    })
    .catch(function(e){
        console.log(e);
    })
}
function useLocation(){
    navigator.geolocation.getCurrentPosition(userLocation, errorCallback);
}

function dropdownForMobiles(){
    if (dropdownContent.style.display==="block") {
        dropdownContent.style.display="none";
    }
    else dropdownContent.style.display="block"
}

//exact time
setInitialTime();
setInterval(incrementSeconds, 1000);
//الواجهة الاولى 

setPrayer(place, city[0].innerText,dayCount,month);

//choosing city
for (let i = 1; i < choices.length; i++) {
    choices[i].addEventListener("click", function(){
        dayCount=getDay();
        month = Number(getMonth());
        
        for (let j = 0; j < choices.length; j++) {  
            choices[j].style.background = "";     // مدري كيف زبط
        }
        city[0].innerText = choices[i].innerText;
        setPrayer(place, city[0].innerText,dayCount,month);
        choices[i].style.background = "#8e013c";
    })
}
const next = document.getElementById("next");
const prev = document.getElementById("prev");

// next button
next.addEventListener("click",function(){
    if (dayCount === setDayBasedOnMonth(month)) {
        dayCount = 0;
        month++;
    }
    dayCount++;
    city[0].innerHTML === location1.innerHTML ? setPrayerBasedLocation(place,dayCount,month,longitude,latitude) : setPrayer(place, city[0].innerText, dayCount,month) ;
})
// prev button
prev.addEventListener("click",function(){
    dayCount--;
    if (dayCount === 0) {
        month--;
        dayCount = setDayBasedOnMonth(month);
    }
    city[0].innerHTML === location1.innerHTML ? setPrayerBasedLocation(place,dayCount,month,longitude,latitude) : setPrayer(place, city[0].innerText, dayCount,month) ;
});
