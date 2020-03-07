'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const request = require('request-promise');
const  { flights }  = require('./test-data/flightSeating');
const PORT = process.env.PORT || 8000;
const flightNumber = {}
//const fetch = require("node-fetch")
//const handlers = require('./public/seat-select/js/seat-select.js');
//const flights = require('./test-data/flightSeating.js')
let userInfo = {}


////////////////
//fetch my data from flightSeating
////////////////

const getFlightData = (req, res) => {
    const { flightNumber } = req.params;
  //  console.log(req.body, "BRUHHHHHHHHHH")
    let flightData = Object.values(flights)
   // console.log(flightData)
    const selectedFlightData = flightData[0];
    res.send({
        status: 'success',
        selectedFlightData: selectedFlightData
    })
    //console.log(selectedFlightData, "-------")
}

const handleSeat = (req, res) => {
    console.log('we are here')
    userInfo =  req.body
    console.log(userInfo, "-------")
res.send({
    status: 'success',
})
}

////////////
//getting my flights api
/////// 

const handleApi = async (req, res) => {
    try {
        let test = {
            uri: "https://journeyedu.herokuapp.com/slingair/flights",
            header: {
                "Accept": "application/json"
            }
        }
        const flights = await request(test)
        console.log(flights, "dsfisdfisdifbaibfshfs")
        const flightInfo = JSON.parse(flights)
        console.log(flightInfo, "--------")
        res.send({
            status: "success",
            flightNumbers: flightInfo.flights
        })
        //return flightInfo
    } catch (err){
        console.log(err.message, "***************")
    }
}
//handleApi()


////////////
//getting my Flights Seats
/////// 

const handleFlightSeats = async (req , res) => {
   // console.log(req, "========")
    let flightNumber = req.params.flight
    //console.log(flightNumber, "-------3333-------")
    try {
        let flightTest = {
            uri:`https://journeyedu.herokuapp.com/slingair/flights/${flightNumber}`,
            header: {
                "Accept": "application/json"
            }
        }
        const seats = await request(flightTest)
        const eachSeat = JSON.parse(seats)
        console.log(eachSeat, "-----eewfawfwefaef--------")
        res.send({
            status: 'success',
            eachSeat: eachSeat
        })
        return eachSeat
    } catch (err) {
        console.log(err, "***********")
    }
}

const handleFlight = (req, res) => {
    const { flightNumber } = req.params;
    // get all flight numbers
    const allFlights = Object.keys(flights);
    // is flightNumber in the array?
    console.log('REAL FLIGHT: ', allFlights.includes(flightNumber))
}


/////////////////////
//handle users and Identification
////////////////////

const handleUsers = async (req, res) =>{
    console.log(req.body, "------here------")
    let data = req.body
    const plise = {
	"email": "d.a@y.ca",
    "flight": "SA666",
    "givenName": "bruh",
    "seat": "5E",
    "surname": "Mcbruh"
}
    data = JSON.stringify(data);
    console.log(data, "--------now HERE--------")
    try{
        let userId = {
            method: "POST",
            uri: "https://journeyedu.herokuapp.com/slingair/users",
            body: {
                email: req.body.email,
                flight: req.body.flight,
                givenName: req.body.givenName,
                seat: req.body.seat,
                surname: req.body.surname
            },
            json: true,
        }
        const eachUser = await request(userId);
        console.log(eachUser)
       // let newUser = JSON.parse(eachUser);
      //  console.log(newUser, "---------444--------")
        res.send({
            eachUser: eachUser.reservation
        })
    } catch (err){
        console.log('erroororororr', err.message);
    }
}



{name: 'Fred'}
express()
    .use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })
	.use(morgan('dev'))
	.use(express.static('public'))
    .use(bodyParser.json())
    .use(express.urlencoded({extended: false}))
    
    // endpoints
    //.get('/flights/:flightNumber', handleFlight)
    .post("/order-confirmed", handleSeat)
    .get("/slingair/flights/:flight", handleFlightSeats)
    //.get('/validateFlight/:flightNumber',  getFlightData)
    .get('/slingair/flights', handleApi)
    .post('/slingair/users', handleUsers)
    //.get('/flight', getFlightData)
    .use((req, res) => res.send('Not Found'))
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));