//const flights = require('./test-data/flightSeating.js');
////////////////////
//GET ELEMENTS BY ID
///////////////////

const flight = document.getElementById('error-message');
const flightInput = document.getElementById('flight');
//console.log(flightInput);
const seatsDiv = document.getElementById('seats-section');

/////////
//FOUR ELEMENTS TO BE USED FOR MY ORDER CONFIRMATION
////////
const confirmButton = document.getElementById('confirm-button');
const name = document.getElementById('givenName');
const last = document.getElementById('surname');
const email = document.getElementById('email');




let flightInfo = {};
let selection = '';

////////////////////
//RENDER SEATS FUNCTION..
///////////////////

const renderSeats = (data) => {
   //console.log(data, "------------");
    document.querySelector('.form-container').style.display = 'block';
    let rowDestroy = document.getElementsByClassName('row')
    rowDestroy = Array.from(rowDestroy)
    rowDestroy.forEach(row => {
        row.remove()
    })
    //console.log(rowDestroy)
    const alpha = ['A', 'B', 'C', 'D', 'E', 'F'];
    for (let r = 1; r < 11; r++) {
        const row = document.createElement('ol');
        row.classList.add('row');
        row.classList.add('fuselage');
        seatsDiv.appendChild(row);
        for (let s = 1; s < 7; s++) {
            const seatNumber = `${r}${alpha[s-1]}`;
            const seat = document.createElement('li');

            // Two types of seats to render
            const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`
            const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`        
            
            // console.log(seatNumber, "working");
            //console.log(data, "FORREAL")
            //console.log(data[seatNumber], "bruhhhhh");
            let selectedSeat = {};
            //console.log(data)
            data.forEach((seat)=> {
                if(seat.id === seatNumber){
                    selectedSeat = seat;
                }
            })
            if (selectedSeat.isAvailable){
                seat.innerHTML = seatAvailable;
            } else {
                seat.innerHTML = seatOccupied;
            }
            
            row.appendChild(seat);
        }
    }
    
    let seatMap = document.forms['seats'].elements['seat'];
    
    seatMap.forEach(seat => {
        seat.onclick = () => {
            selection = seat.value;
            seatMap.forEach(x => {
                if (x.value !== seat.value) {
                    document.getElementById(x.value).classList.remove('selected');
                }
            })
            document.getElementById(seat.value).classList.add('selected');
            document.getElementById('seat-number').innerText = `(${selection})`;
            confirmButton.disabled = false;
        }
    });
}



////////////////////
///fetching my flight details for each flight
////////////////////


const toggleFormContent = (flightNumber) => {
    console.log(flightNumber, "event")
   // const flightNumber = flightInput.value;
    //console.log('toggleFormContent: ', flightNumber);
    //fetch(`/flights/${flightNumber}`)
      //  .then(res => res.json())
       // .then(data => {
    //console.log(data);
        //})
    //let flightNumber = flightInput.value
    const data = {
        flightNumber: flightNumber
    }
    fetch(`/slingair/flights/${flightNumber}`)
        .then(res=> res.json())
        .then(data => {
        //console.log(data, "----data------");
       // console.log(data.eachSeat[flightNumber], '++++++++');
        renderSeats(data.eachSeat[flightNumber]);
        });
    // TODO: contact the server to get the seating availability
    //      - only contact the server if the flight number is this format 'SA###'. completed sort of
    //      - Do I need to create an error message if the number is not valid? completed.. 
    
    // TODO: Pass the response data to renderSeats to create the appropriate seat-type.
}



const handleConfirmSeat = (event) => {
    event.preventDefault()
    console.log("***EVENT", event)
   // let elements = event.target.elements;
    const userInfo = {
        email: email.value,
        flight: flightInput.value,
        givenName: name.value,
        seat: selection,
        surname: last.value
    }
    const options = {
        method: "POST",
        body: JSON.stringify(userInfo),
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        }
    }
    fetch('/slingair/users', options)
        .then(res => { 
            //console.log("***After HERE",res)
            return res.json()})
        .then(data => {
            console.log("***Finally HERE",data)
            window.location.href = `/seat-select/confirmed.html?givenName=${data.eachUser.givenName}&surname=${data.eachUser.surname}&email=${data.eachUser.email}&id=${data.eachUser.id}&flight=${data.eachUser.flight}&seat=${data.eachUser.seat}`
        })
        
        
        .catch(error => console.error(error))

}
const getDropdown = () => {
    console.log("hello")
    fetch('/slingair/flights')
    .then(res => {
        //console.log("i got it!!!", res)
        return res.json()})
    .then(data => {
       // console.log(data, "DATA RECIEVED")
        data.flightNumbers.forEach(flight => {
           // console.log(flight, "4444444")
            flightDrop = document.createElement('option');
            flightDrop.value = flight;
            flightDrop.innerText = flight;
            flightInput.appendChild(flightDrop)
            //console.log(flightInput, "222222")
        })
    })
}
getDropdown()

//flightInput.addEventListener('blur', toggleFormContent);