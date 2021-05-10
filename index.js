const prompt = require('prompt-sync')()
const axios = require('axios').default
const chalk = require('chalk')

let districtID, stateID, month, dateToBook, ageAbove45

const headers = { 'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36' }
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

axios.get('https://cdn-api.co-vin.in/api/v2/admin/location/states', { headers: headers })
    .then(response => {
        
        response.data.states
            .sort((a,b) => a.state_id > b.state_id ? 1 : -1)
            .forEach(({state_id, state_name}) => {
                console.log(state_id + ' : ' + state_name)
            })
        
        stateID = prompt(chalk.bgWhiteBright.black('Enter the ID of your state : '))

        axios.get(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${stateID}`, { headers : headers })
            .then(response => {
                
                response.data.districts
                    .sort((a,b) => a.district_name > b.district_name ? 1 : -1)
                    .forEach(({district_id, district_name}) => {
                        console.log(district_id + ' : ' + district_name)
                    })

                districtID = prompt('Enter the ID of your district')

                month = new Date().getMonth()
                dateToBook = prompt('Enter the day of ' + months[month+1] + ' on which you want to get vaccine')

                if(month.length === 1) month = '0'.concat(month)
                if(dateToBook.length === 1) dateToBook = '0'.concat(dateToBook)

                ageAbove45 = parseInt(prompt('Enter your age : ')) >= 45

                while (true) {

                    let uri = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=${districtID}&date=${dateToBook}-${month}-2021`
                    axios.get(uri, {
                        headers: {
                            'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
                            'Accept-Language' : 'en_US',
                            'accepts' : 'application/json'
                        }
                    })
                        .then(response => {
                            
                            const { from, to, fee_type, vaccine_fees, sessions} = response.data.from
                            
                            sessions.forEach(session => {
                                const { available_capacity, min_age_limit, vaccine, slots } = session
                            })
                        })
                        .catch(err => console.log(err))
                }
            })
            .catch(err => console.log(err))
    })
    .catch(err => console.log(err))