const prompt = require('prompt-sync')()
const axios = require('axios').default
const chalk = require('chalk')

let districtID, stateID, month, dateToBook, age

const headers = { 'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36' }
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

axios.get('https://cdn-api.co-vin.in/api/v2/admin/location/states', { headers: headers })
    .then(response => {
        
        console.table(response.data.states.sort((a,b) => a.state_id > b.state_id ? 1 : -1), ['state_id', 'state_name'])          
        console.log()
        stateID = prompt(chalk.bgWhiteBright.black('Enter the ID of your state : '))

        axios.get(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${stateID}`, { headers : headers })
            .then(response => {
                
                console.table(response.data.districts.sort((a,b) => a.district_name > b.district_name ? 1 : -1))
                    
                districtID = prompt(chalk.bgWhiteBright.black('Enter the ID of your district'))

                month = new Date().getMonth()
                console.log()
                dateToBook = prompt(chalk.bgWhiteBright.black('Enter the day of ' + months[month] + ' on which you want to get vaccine'))

                if(month.length === 1) month = '0'.concat(month)
                if(dateToBook.length === 1) dateToBook = '0'.concat(dateToBook)

                console.log()
                age = prompt(chalk.bgWhiteBright.black('Enter your age : '))

                    let uri = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${districtID}&date=${dateToBook}-${month+1}-2021`
                    axios.get(uri, {
                        headers: {
                            'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36',
                            'Accept-Language' : 'en_US',
                            'accepts' : 'application/json'
                        }
                    })
                        .then(response => {

                            if(response.status !== 200) {
                                console.log(chalk.bgRed.black('Error recieving data. CoWIN server might be down or there is some application error. Please try again'))
                                return
                            }
                            
                            const sessions = response.data.sessions.filter(session => session.min_age_limit < parseInt(age))
                            
                            if(!sessions.length) {
                                console.log(chalk.bgRed.black('No vaccine slots available')) 
                                return
                            }
                            
                            console.log(chalk.bgGreenBright.black('Data found. Showing top 20 results'))
                            console.table(sessions.slice(0,20), ['center_id', 'name', 'pincode', 'from', 'to', 'available_capacity', 'fee', 'min_age_limit'])
                            
                        })
                        .catch(err => console.log(err))
                
            })
            .catch(err => console.log(err))
    })
    .catch(err => console.log(err))