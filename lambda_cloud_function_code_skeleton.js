'use strict';

const AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient({
    region: 'ap-southeast-1'
});

exports.handler = function(event, context, callback) {
    const paper = event.queryResult.parameters['Paper'];                     //The following variables store incoming parameter values from a 
    const pre_req = event.queryResult.parameters['pre-req'];				// JSON file sent by DialogFlow. Depending on the users question or query
    const co_req = event.queryResult.parameters['co-req'];				   // The parameters will be updated based on the context of request.
    const key_date = event.queryResult.parameters['Keydates'];			   // E.G if a user asks about semester dates, the parameter keydates will be sent through.
    const manukau = event.queryResult.parameters['manukau'];


    function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
     }


       // PRE-REQ HANDLER
	   
	   if (pre_req != null) {

        var params = {
            TableName: 'paperInformationChatBot',
            ProjectionExpression: 'Prerequisites, Paper_Name, PrerequisitesAdditional', 
            FilterExpression: 'Paper_Code = :paper_code',
            ExpressionAttributeValues: {
                ":paper_code": paper
            }
        };


        docClient.scan(params, function(err, data) {
            if (err) {
                console.log(err, null); // an error occurred // 
            } else {
                console.log(data);

                var paper_name = data.Items[0].Paper_Name;
                var paper_prerequisite = data.Items[0].Prerequisites;
                var add_prerequisite = data.Items[0].PrerequisitesAdditional;

                console.log(paper_prerequisite);
                if (paper_prerequisite == "None" && add_prerequisite == "None") {
                    callback(null, {
                        fulfillmentText: "" + paper_name + " has no prerequisites."
                    });
                }
                else if (paper_prerequisite != "None" && add_prerequisite == "None") {
                    callback(null, {
                        fulfillmentText: "The prerequisites for " + paper_name + " is " + paper_prerequisite
                    });
                }
                else if (paper_prerequisite == "None" && add_prerequisite != "None") {
                    callback(null, {
                        fulfillmentText: "The prerequisites for " + paper_name + " are any one of " + add_prerequisite 
                    });
                }
                else if (add_prerequisite != "None") {
                    callback(null, {
                        fulfillmentText: "The prerequisite for " + paper_name + " is " + paper_prerequisite + " and any one of " + add_prerequisite
                    });
                    
                }

            }

        });
        
    
        
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