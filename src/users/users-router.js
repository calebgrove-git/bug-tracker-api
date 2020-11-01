const path = require('path');
const express = require('express');
const xss = require('xss');
const UserService = require('./users-service');
const { brotliCompressSync } = require('zlib');

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
      const newUser = {  email, hashedPass, admin, company };
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
  .all((req, res, next) => {
    UserService.getById(req.app.get('db'), req.body.email, req.body.password)
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            error: { message: `User doesn't exist` },
          });
        }
        res.user = user;
        next();
      })
      .catch(next);
  })
  .post( async (req, res, next) => {
    try{
     if(await bcrypt.compare(req.body.password, user.password)){
       res.send('Success')
     } else{
       res.send('Not allowed')
     }
    }
    catch{
      res.status(500).send()
    }
  })
  
  

module.exports = usersRouter;