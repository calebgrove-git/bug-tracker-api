const path = require('path');
const express = require('express');
const xss = require('xss');
const BugsService = require('./bugs-service');

const bugsRouter = express.Router();
const jsonParser = express.json();

const serializeBug = (bug) => ({
  id: bug.id,
  name: xss(bug.name),
  details: xss(bug.details),
  steps: xss(bug.steps),
  version: xss(bug.version),
  creator: xss(bug.creator),
  priority: bug.priority,
  time: bug.time,
  company: xss(bug.company),
  completed: bug.completed
});

bugsRouter
  .route('/')
  .post(jsonParser, (req, res, next) => {
    const {name, details, steps, version,  creator, priority, company} = req.body;
    const newBug = {name, details, steps, version,  creator, priority, company };
    console.log(req.body)
    for (const [key, value] of Object.entries(newBug)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    BugsService.insertBug(req.app.get('db'), newBug)
      .then((bug) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${bug.id}`))
          .json(serializeBug(bug));
      })
      .catch(next);
  });

bugsRouter
  .route('/:id')
  .all((req, res, next) => {
    BugsService.getById(req.app.get('db'), req.params.id)
      .then((bug) => {
        if (!bug) {
          return res.status(404).json({
            error: { message: `Bug doesn't exist` },
          });
        }
        res.bug = bug;
        next();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    BugsService.deleteBug(req.app.get('db'), req.params.id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const {id, name, details, steps, version,  creator, priority, company, } = req.body;
    const bugToUpdate = {id, name, details, steps, version,  creator, priority, company};
    for (const [key, value] of Object.entries(bugToUpdate)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    BugsService.updateBug(req.app.get('db'), req.params.id, bugToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });
  bugsRouter
  .route('/:id/complete')
  .all((req, res, next) => {
    BugsService.getById(req.app.get('db'), req.params.id)
      .then((bug) => {
        if (!bug) {
          return res.status(404).json({
            error: { message: `Bug doesn't exist` },
          });
        }
        res.bug = bug;
        next();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const {id, name, details, steps, version,  creator, priority, company} = req.body;
    const completed = true
    const bugToUpdate = {id, name, details, steps, version,  creator, priority, company, completed};
    for (const [key, value] of Object.entries(bugToUpdate)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }
    BugsService.updateBug(req.app.get('db'), req.params.id, bugToUpdate)
    .then((numRowsAffected) => {
      res.status(204).end();
    })
    .catch(next);
});
bugsRouter
.route('/get/:company')
.get((req, res, next) => {
console.log(req.params.company)
  BugsService.getAllBugs(req.app.get('db'), req.params.company)
    .then((bugs) => {
      res.json(bugs.map(serializeBug));
    })
    .catch(next);
})
module.exports = bugsRouter;
