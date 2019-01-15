var axios = require('axios');
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

import { User, GroceryItem, Order, Driver } from '../models/models.js'
import Stripe from 'stripe';
const stripe = Stripe(process.env.STRIPE_API_KEY);

//Driver Register
router.post('/register', (req, res) => {
    console.log('body', req.body);
    Driver.findOne({username: req.body.username})
    .then((driver) => {
      console.log('driver', driver);
      if(driver) {
        res.json({
          success: false,
          message: "Username already exists!"
        })
      }
      else {
        const newDriver = new Driver({
          username: req.body.username,
          password: req.body.password
        });
        newDriver.save()
        .then(user => {
          res.json({
            success: true,
            message: `Successfully registered a new driver: ${user.username}!`
          });
        })
        .catch(error => {
          res.json({
            success: false,
            message: `Error: ${error}`
          });
        })
      }
    })
  });

//Driver Login
router.post('/login',(req,res) =>{
  console.log('booty', req.body)
  Driver.findOne({username:req.body.username}, function(err, user) {
    if (err) {
      console.error(err);
      res.json({
        success:false,
        message: "Error!" + err
      });
    }
    else if (!user) {
      console.log("user",user);
      res.json({
        success:false,
        message: "Invalid user"
      });
    }
    //if passwords don't match, authorization failed
    else if (user.password !== req.body.password) {
      res.json({
        success: false,
        message:"Incorrect password"
      })
    }
    else{ console.log({user:req.body})
    //if authorization succeeds
    res.json({
      success: true,
      driverId: user._id
    })
  }
});
});

//Driver Orders
router.get('/orders',(req,res) =>{
  console.log('orders', req.body)
  Order.find({status:"ordered"}, function(err, orders){
    if (err) {
      console.error(err);
      res.json({
        success:false,
        message: "Error!" + err
      });
    } 
    else if (!orders) {
      console.log('order', order);
      res.json({
        success:false,
        message: "No orders"
      });
    }
    else {
      res.json({
        success:true,
        orders: orders
      })
    }
  })
});


//RenderAvaliableOrder
//router.post('/selectOrder',)




module.exports = router;