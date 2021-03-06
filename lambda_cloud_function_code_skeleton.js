'use strict';

const AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient({
    region: 'ap-southeast-1'
});

exports.handler = function(event, context, callback) {
    const paper = event.queryResult.parameters['Paper']; //The following variables store incoming parameter values from a 
    const pre_req = event.queryResult.parameters['pre-req']; // JSON file sent by DialogFlow. Depending on the users question or query
    const co_req = event.queryResult.parameters['co-req']; // The parameters will be updated based on the context of request.
    const key_date = event.queryResult.parameters['Keydates']; // E.G if a user asks about semester dates, the parameter keydates will be sent through.
    const manukau = event.queryResult.parameters['manukau'];
    const prescriptor = event.queryResult.parameters['prescriptor'];
    const core = event.queryResult.parameters['core'];
    const job = event.queryResult.parameters['job'];
    const year = event.queryResult.parameters['year'];


    function fallback(agent) { //Fall back agent, If a query cannot be matched fallback agent is called.
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }


    // PRE-REQ HANDLER // Handles any intent regarding prerequisites for papers in software development

    if (pre_req != null) { // If pre_req was defined in a parameter, continue with the embedded functions, else check next if statement

        var params = { //params houses the query parameters based on those fed by DialogFlow
            TableName: 'paperInformationChatBot', // Reference to the table name (We have two tables in total as of this comment
            ProjectionExpression: 'Prerequisites, Paper_Name, PrerequisitesAdditional', // Projection of the desired results/values sent to our functions
            FilterExpression: 'Paper_Code = :paper_code', // Filter expression defines what element to look in I.e COMP500 elements
            ExpressionAttributeValues: {
                ":paper_code": paper // The parameter recieved from the user being assigned as the filter expression variable.
            }
        }; 														////////////////////////////
        														// For documentations sake//
       															// all relevant commenting//		
        docClient.scan(params, function(err, data) { 			// will be referenced here//
            if (err) {										    // only. Other functions  //
                console.log(err, null); 						// an error occurred 	  // 		
																// perform with similar   //
            } else { 											// nature and further     //
																// commenting would be    //
																// unneccasary            //
                												////////////////////////////

                console.log(data); 								// Standard dev testing //		
               

                var paper_name = data.Items[0].Paper_Name; // values recieved from the scan result are returned in an object (data)
                var paper_prerequisite = data.Items[0].Prerequisites; // .Prerequisites points to the prerequisite value within the object recieved.
                var add_prerequisite = data.Items[0].PrerequisitesAdditional; //Items[0] essentially refers to the first object returned

                console.log(paper_prerequisite);
                if (paper_prerequisite == "None" && add_prerequisite == "None") { //Conditionial logic for whether a paper has prerequisites or not
                    callback(null, {
                        fulfillmentText: "" + paper_name + " has no prerequisites." // The callback contains the fulfillmentText parameter
                    });
                } else if (paper_prerequisite != "None" && add_prerequisite == "None") {
                    callback(null, {
                        fulfillmentText: "The prerequisites for " + paper_name + " is " + paper_prerequisite // the fulfillmentText parameter provides the 
                    }); // chat bot with the neccassary output
                } else if (paper_prerequisite == "None" && add_prerequisite != "None") {
                    callback(null, {
                        fulfillmentText: "The prerequisites for " + paper_name + " are any one of " + add_prerequisite
                    });
                } else if (add_prerequisite != "None") {
                    callback(null, {
                        fulfillmentText: "The prerequisite for " + paper_name + " is " + paper_prerequisite + " and any one of " + add_prerequisite
                    });

                }

            }

        });



        //CO-REQ HANDLER


    } else if (co_req != null) {

        params = {
            TableName: 'paperInformationChatBot',
            ProjectionExpression: 'Corequisites, Paper_Name, PrerequisitesAdditional', // remove this string if you want to get not only 'name'
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
                var paper_corequisite = data.Items[0].Corequisites;
                var paper_prerequisite = data.Items[0].PrerequisitesAdditional;

                console.log(paper_corequisite);
                if (paper_corequisite == "None") {
                    callback(null, {
                        fulfillmentText: "" + paper_name + " has no corequisites."
                    });
                } else if (paper_corequisite != "None" && paper_prerequisite != "None") {
                    callback(null, {
                        fulfillmentText: "The corequisite for " + paper_name + " is " + paper_corequisite + " and the prerequisites are " + paper_prerequisite
                    });
                } else {
                    callback(null, {
                        fulfillmentText: "The corequisite for " + paper_name + " is " + paper_corequisite
                    });
                }

            }

        });

        //PRESCRIPTOR

    } else if (prescriptor != null) {

        params = {
            TableName: 'paperInformationChatBot',
            ProjectionExpression: 'Paper_Name, Prescriptor', // remove this string if you want to get not only 'name'
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
                var paper_prescriptor = data.Items[0].Prescriptor;


                callback(null, {
                    fulfillmentText: "Paper prescriptor for " + paper_name + ": " + paper_prescriptor
                });



            }

        });


        // YEAR AVAILABLE

    } else if (year != null) {

        params = {
            TableName: 'paperInformationChatBot',
            ProjectionExpression: 'Paper_Name, paperLevel', // remove this string if you want to get not only 'name'
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
                var paper_year = data.Items[0].paperLevel;

                if (paper_year == "5") {
                    callback(null, {
                        fulfillmentText: paper_name + " is available the first year of your studies."
                    });
                } else if (paper_year == "6") {
                    callback(null, {
                        fulfillmentText: paper_name + " is available in year 2 of your studies."
                    });
                } else if (paper_year == "7") {
                    callback(null, {
                        fulfillmentText: paper_name + " is available in year 3 of your studies."
                    });
                }

            }

        });

        // CORE PAPER

    } else if (core != null) {

        params = {
            TableName: 'paperInformationChatBot',
            ProjectionExpression: 'Paper_Name, Core', // remove this string if you want to get not only 'name'
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
                var paper_core = data.Items[0].Core;

                if (paper_core == "Yes") {
                    callback(null, {
                        fulfillmentText: paper_core + ", " + paper_name + " is a core paper for Software Development"
                    });
                } else if (paper_core == "No") {
                    callback(null, {
                        fulfillmentText: paper_core + ", " + paper_name + " is not a core paper for Software Development"
                    });
                }

            }

        });

        // JOB RELATION

    } else if (job != null) {

        params = {
            TableName: 'paperInformationChatBot',
            ProjectionExpression: 'Paper_Name, Job', // remove this string if you want to get not only 'name'
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
                var paper_job = data.Items[0].Job;

                callback(null, {
                    fulfillmentText: "Examples of related jobs for " + paper_name + " include: " + paper_job
                });



            }

        });


        // KEY-DATE HANDLER
    } else if (key_date != null) {

        var parameter2 = key_date[0];
        var parameter1 = key_date[1];

        console.log(parameter1 + parameter2);

        var table_scope;
        var fulfillmentScopeText;
        var fulfillmentScopeDate;

        var fulfillmentStart = " starts ";
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

        if (parameter1 == "start" && parameter2 == "semester1") {
            table_scope = "FirstDaySem1";
            fulfillmentScopeText = fulfillmentFirst;
            fulfillmentScopeDate = semester1;
        } else if (parameter1 == "end" && parameter2 == "semester1") {
            table_scope = "LastDaySem1";
            fulfillmentScopeText = fulfillmentLast;
            fulfillmentScopeDate = semester1;
        } else if (parameter1 == "semester1" && parameter2 == "when") {
            table_scope = "Semester1Dates";
            fulfillmentScopeText = fulfillmentBetween;
            fulfillmentScopeDate = semester1;
        }

        //SEMESTER 2 DATES
        else if (parameter1 == "start" && parameter2 == "semester2") {
            table_scope = "FirstDaySem2";
            fulfillmentScopeText = fulfillmentStart;
            fulfillmentScopeDate = semester2;
        } else if (parameter1 == "end" && parameter2 == "semester2") {
            table_scope = "LastDaySem2";
            fulfillmentScopeText = fulfillmentEnd;
            fulfillmentScopeDate = semester2;
        } else if (parameter1 == "semester2" && parameter2 == "when") {
            table_scope = "Semester2Dates";
            fulfillmentScopeText = fulfillmentBetween;
            fulfillmentScopeDate = semester2;
        }


        // SUMMER SCHOOL DATES
        else if (parameter1 == "end" && parameter2 == "summerschool") {
            table_scope = "LastDaySummer";
            fulfillmentScopeText = fulfillmentLast;
            fulfillmentScopeDate = summerSchool;
        } else if (parameter1 == "start" && parameter2 == "summerschool") {
            table_scope = "FirstDaySummer";
            fulfillmentScopeText = fulfillmentStart;
            fulfillmentScopeDate = summerSchool;
        } else if (parameter1 == "summerschool" && parameter2 == "when") {
            table_scope = "SummerSchoolDates";
            fulfillmentScopeText = fulfillmentBetween;
            fulfillmentScopeDate = summerSchool;
        }

        // EASTER BREAK
        else if (parameter2 == "easter") {
            table_scope = "EasterBreak";
            fulfillmentScopeText = easterBreak;
            fulfillmentScopeDate = "The dates for ";
        }

        // MID SEM BREAK
        else if (parameter2 == "midsembreak" && parameter1 == "semester1") {
            table_scope = "Sem1MidBreak";
            fulfillmentScopeText = midSemBreak;
            fulfillmentScopeDate = semester1;

        } else if (parameter2 == "midsembreak" && parameter1 == "semester2") {
            table_scope = "Sem2MidBreak";
            fulfillmentScopeText = midSemBreak;
            fulfillmentScopeDate = semester2;

        } else if (parameter2 == "midsembreak") {
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

    } else if (manukau != null) {
        console.log(paper);
        var params = {
            TableName: 'paperInformationChatBot',
            ProjectionExpression: 'Paper_Name, Manukau',
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
                var is_manukau = data.Items[0].Manukau;

                if (is_manukau == "Yes, Semester 2 has availability") {
                    callback(null, {
                        fulfillmentText: is_manukau + " for " + paper_name
                    });


                } else if (is_manukau == "Yes, Semester 1 has availability") {
                    callback(null, {
                        fulfillmentText: is_manukau + " for " + paper_name
                    });


                } else if (is_manukau == "No") {
                    callback(null, {
                        fulfillmentText: "There are unfortunately no streams for " + paper_name + " at Manukau Campus this year"
                    });


                } else if (is_manukau == "Yes, Both Semesters are available") {
                    callback(null, {
                        fulfillmentText: is_manukau + " for " + paper_name
                    });


                } else {
                    callback(null, {
                        fulfillmentText: "Sorry, I failed to understand your question regarding Manukau"
                    });
                }
            }
        })

    } else {
        callback(null, {
            fulfillmentText: "Nothing was called!" //Global error fallback. If a major logical error occurs this will be returned.
        });
    }
};