'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
const util = require('util');
const R = require("ramda");

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
  decide: decide
};

const decideOn = R.cond([
  [stock => R.equals("USD",stock.cur),    R.always("ignore")],
  [stock => R.equals("CHF",stock.cur),    R.always("ignore")],
  [stock => R.equals("CAD",stock.cur),    R.always("ignore")],
  [stock => stock.dailyaverageeuro<10000, R.always("ignore")],  
  [stock => stock.price>stock.value,      R.always("sell")],
  [stock => stock.price*2<stock.value,    R.always("buy")],   
  [R.T,                                   R.always("wait")]
])

function decide(req,res) {
  if(req.body.stocks) {
    let feedback = [];
    req.body.stocks.forEach(function(el,index) {
      //console.log(JSON.stringify(el));
      const decision = decideOn(el);
      let ticker = el.ticker;
      let ans = {};
      ans.action = decision;
      ans.ticker = ticker;
      feedback.push(ans);
    }
    );
    //console.log(feedback);
    res.header('Content-Type', 'application/json') ;
    res.send(JSON.stringify(feedback,null,4)) ;
  } else {
    res.header('Content-Type', 'application/json') ;
    res.send(JSON.stringify({},null,4)) ;
  }
}
