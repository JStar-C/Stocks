    import {tickers} from './tickers.js';
    import {API_KEY} from './keys.js';

    var MAX_PRICE = 75.00;     // cost per 100 contracts
    var MIN_DELTA = 0.4;      // miniumum delta value
    var DeltaToThetaRatio = 3; // delta/theta ratio

    // scan each ticker
    $(document).ready(async function () {
        for(let i = 0; i < tickers.length; i++)
        {
            getOptions(tickers[i]);
        }
    });

    // output all options from ticker matching the query 
    async function getOptions(symbol) {
        // make API call
        let response = await fetch(`https://api.tdameritrade.com/v1/marketdata/chains?apikey=${API_KEY}&symbol=${symbol}&contractType=CALL&range=OTM&optionType=S`);
        let data = await response.json();
        data = Object.values(data.callExpDateMap);

        // loop through weekly options lists
        data.forEach(function(callList) {

            // loop through each option in a week
            Object.values(callList).forEach(function(singleCall) {
                // get data
                let option = singleCall[0]; // get option object, and remove string artifacts
                let name   = option.description.slice(0, option.description.search("Call"));
                let theta  = option.theta;
                let delta  = option.delta;
                let ask    = (option.ask * 100).toFixed(2);
                let ratio  = (delta / theta).toFixed(2);

                //check if query conditions are met
                if (ratio < -(DeltaToThetaRatio) && ask < MAX_PRICE && delta > MIN_DELTA)
                {
                    // output data to console
                    console.log(`${name}\n\tTheta:  ${theta.toFixed(3)}          \
                                        \n\tDelta:   ${delta.toFixed(3)}          \
                                        \n\tRatio:   ${Math.abs(ratio).toFixed(3)} \
                                        \n\t  Ask: $${ask}`);
                }
            });
        });       
    }
