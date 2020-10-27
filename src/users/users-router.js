const path = require('path');
const express = require('express');
const xss = require('xss');
const UserService = require('./users-service');

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
  .post(jsonParser, (req, res, next) => {
    const { email, password, admin, company } = req.body;
    const newUser = {  email, password, admin, company };

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
  });

usersRouter
  .route('/:email/:password')
  .all((req, res, next) => {
    UserService.getById(req.app.get('db'), req.params.email, req.params.password)
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
  .get((req, res, next) => {
    res.json(serializeUser(res.user));
  })
  
  

module.exports = usersRouter;