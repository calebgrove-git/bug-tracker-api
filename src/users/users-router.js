require('dotenv').config()
const path = require('path');
const express = require('express');
const xss = require('xss');
const bcrypt = require('bcrypt')
const UserService = require('./users-service');
const jwt = require('jsonwebtoken')


const usersRouter = express.Router();
const jsonParser = express.json();

const serializeUser = (user) => ({
  id: user.id,
  email: xss(user.email),
  password: xss(user.password),
  admin: user.admin,
  company: xss(user.company)
});
usersRouter
  .route('/create')
  .post(jsonParser, async (req, res, next) => {
    try{
      const { email, password, admin, company } = req.body;
      const salt = await bcrypt.genSalt()
      const hashedPass = await bcrypt.hash(password,salt)
      const newUser = {  email, password: hashedPass, admin, company };
      for (const [key, value] of Object.entries(newUser)) {
        if (value == null) {
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` },
          });
        }
      }
  
      UserService.insertUser(req.app.get('db'), newUser)
        .then((user) => {
          res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${user.name}`))
            .json(serializeUser(user));
        })
        .catch(next);
    }
    catch{
      res.status(500).send()
    }
  });

usersRouter
  .route('/login')
  .post(jsonParser,async (req, res, next) => {
    const {email, password} = req.body
    const unautorizedUser = {email, password}
    UserService.getById(req.app.get('db'), unautorizedUser.email)
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            error: { message: `User doesn't exist` },
          })
        }
        return user
      })
      .then((user)=>{
       const bool = bcrypt.compare(unautorizedUser.password, user.password)
       return {bool, user}
      })
      .then((response)=>{
        const user = serializeUser(response.user)
        if(response.bool){
          res.json(user) }
        next()
      })
      .catch(next)
  })
  
  

module.exports = usersRouter;
