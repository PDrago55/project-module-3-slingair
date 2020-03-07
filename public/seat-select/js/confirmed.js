////////////////////
//GET ELEMENTS BY ID
///////////////////

const flightNum = document.getElementById('flight');
const seatNum = document.getElementById('seat');
const name = document.getElementById('name');
const email = document.getElementById('email');
const id = document.createElement("span")
document.getElementById('bruh').appendChild(id)
//console.log(window.location.search)
let searchParams = (window.location.search)
let url = new URL (window.location.href)
// console.log(params)
searchParams = searchParams.split('?')
searchParams = searchParams[1].split(/['=' '&']/)
//console.log(searchParams)

let filterParams = searchParams.filter((x, index ) => {
    if (index % 2 === 1){
        return x
    }
})
console.log(filterParams)
flightNum.innerText = `${filterParams[4]}`;
seatNum.innerText = `${filterParams[5]}`;
name.innerText = `${filterParams[0]} ${filterParams[1]} `;
email.innerText = `${filterParams[2]}`;
id.innerText = `${filterParams[3]}`

/////////////////
/////forEaching my order confirmation pages
////////////////


