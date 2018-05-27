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
                  }else if(key_date != null){
           
           var parameter2 = key_date[0];
           var parameter1 = key_date[1];
           
           console.log(parameter1+parameter2);
           
           var table_scope;
           var fulfillmentScopeText;
           var fulfillmentScopeDate;
           
           var fulfillmentStart =  " starts ";
           var fulfillmentEnd = " ends ";
           var fulfillmentFirst = " has its first day ";
           var fulfillmentLast = " has its last day ";
           var fulfillmentBetween = " is available between ";
           var semester1 = "Semester 1";
           var semester2 = "Semester 2";
           var summerSchool = "Summer School";
           var easterBreak = "Easter break are ";
           var midSemBreak = " mid semester break periods are "
           
           //SEMESTER 1 DATES
           
           if(parameter1 == "start" && parameter2 == "semester1"){
               table_scope = "FirstDaySem1";
               fulfillmentScopeText = fulfillmentFirst;
               fulfillmentScopeDate = semester1;
           }   
           else if(parameter1 == "end" && parameter2 == "semester1"){
               table_scope = "LastDaySem1";
               fulfillmentScopeText = fulfillmentLast;
               fulfillmentScopeDate = semester1;
           }
             else if(parameter1 == "semester1" && parameter2 == "when"){
               table_scope = "Semester1Dates";
               fulfillmentScopeText = fulfillmentBetween;
               fulfillmentScopeDate = semester1;
           }
           
           //SEMESTER 2 DATES
           
           else if(parameter1 == "start" && parameter2 == "semester2"){
               table_scope = "FirstDaySem2";
               fulfillmentScopeText = fulfillmentStart;
               fulfillmentScopeDate = semester2;
           }   
           else if(parameter1 == "end" && parameter2 == "semester2"){
               table_scope = "LastDaySem2";
               fulfillmentScopeText = fulfillmentEnd;
               fulfillmentScopeDate = semester2;
           }
          
           else if(parameter1 == "semester2" && parameter2 == "when"){
               table_scope = "Semester2Dates";
               fulfillmentScopeText = fulfillmentBetween;
               fulfillmentScopeDate = semester2;
           }
       
	   //SEMESTER 1 DATES
           
          
       //SEMESTER 2 DATES
           
          
       // SUMMER SCHOOL DATES
     
           
       // EASTER BREAK
           
                  
       // MID SEM BREAK
           else if(parameter2 == "midsembreak" && parameter1 == "semester1"){
               table_scope = "Sem1MidBreak";
               fulfillmentScopeText = midSemBreak;
               fulfillmentScopeDate = semester1;

           }
           else if(parameter2 == "midsembreak" && parameter1 == "semester2"){
               table_scope = "Sem2MidBreak";
               fulfillmentScopeText = midSemBreak;
               fulfillmentScopeDate = semester2;

           }
           else if (parameter2 == "midsembreak"){
               table_scope = "midSemBreak";
               fulfillmentScopeText = midSemBreak;
               fulfillmentScopeDate = "This years";
           }




           console.log(table_scope);

           params = {
            TableName: 'generalInformationChatbot',
            ProjectionExpression: 'dateValue', // remove this string if you want to get not only 'name'
            FilterExpression: 'informationType = :table_scope',
            ExpressionAttributeValues: {
                ":table_scope": table_scope
            }
           };
           docClient.scan(params, function(err, data) {
            if (err) {
                console.log(err, null); // an error occurred // 
            } else {
                console.log(data);

                var dateValue = data.Items[0].dateValue;

                console.log(dateValue);


            callback(null, {
                        fulfillmentText: fulfillmentScopeDate + fulfillmentScopeText + dateValue
                    });


            }

        })
                  
       // MANUKAU
        
     
        
    } else {
        callback(null, {
            fulfillmentText: "Nothing was called!"
        });
    }
};