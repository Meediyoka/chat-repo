'use strict';

const AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient({
    region: 'ap-southeast-1'
});

exports.handler = function(event, context, callback) {
    const paper = event.queryResult.parameters['Paper'];
    const pre_req = event.queryResult.parameters['pre-req'];
    const co_req = event.queryResult.parameters['co-req'];
    const key_date = event.queryResult.parameters['Keydates'];
    const manukau = event.queryResult.parameters['manukau'];


    function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
     }


       // PRE-REQ HANDLER
    
        
	   //CO-REQ HANDLER

	   
	   // KEY-DATE HANDLER
           
       
	   //SEMESTER 1 DATES
           
          
       //SEMESTER 2 DATES
           
          
       // SUMMER SCHOOL DATES
     
           
       // EASTER BREAK
           
                  
       // MID SEM BREAK
           
                  
       // MANUKAU
        
     
        
    } else {
        callback(null, {
            fulfillmentText: "Nothing was called!"
        });
    }
};