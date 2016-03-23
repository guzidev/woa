var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

module.exports = function (app) {
  app.use('/woa/users', router);
};

/**
 * Function to verify that userIdentity is provided and valid
 */
function checkUserExists(req, res, next){
  User.findById(req.body.userIdentity, function(err, existingUser){
    if (err){
      res.status(500).send(err);
    return;
    } else if (!existingUser){
        res.status(404).send('You are not authorised to be here');
      return;
    }
    req.user = existingUser;

    next();
  });
}

// POST /api/users 
//router.post('/', checkUserExists, function (req, res, next) {
router.post('/', function (req, res, next) {
  var user = new User(req.body);
  user.save(function (err, createdUser){
    if (err){
      res.status(500).send(err);
      return;
    }
    res.send(createdUser);
  });
});



// GET /api/users
router.get('/', function(req, res, next) {

  // Create search criteria.. 
      var criteria = {};
      // TO DO: Search criteria by most Issues..
      /*
      // Search criteria by tags..
      if(typeof(req.query.tags) == "object" && req.query.tags.length) {
          criteria.tags= {$in:req.query.tags};
      } else if (req.query.tags){
          criteria.tags=req.query.tags;
      }
      
      // Search criteria by authorname..
      if(typeof(req.query.authorname) == "object" && req.query.authorname.length) {
          criteria.authorname= {$in:req.query.authorname};
      } else if (req.query.authorname){
          criteria.authorname=req.query.authorname;
      }
      */

  // Pagination of Users..
      var page = req.query.page ? parseInt(req.query.page, 10) : 1,
        pagesize = req.query.pagesize ? parseInt(req.query.pagesize, 10) : 30;

      var offset = (page-1)*pagesize, 
        limit = pagesize;

      // Count number of Users..
      User.count(function(err,totalCount){
        if (err){
            console.log('erreur total count');
            res.status(500).send(err);
            return;
        }
        // Count number of Users filtered by search criteria.. 
        User.count(criteria, function(err, filteredCount){
          if (err){
            console.log('erreur filter count');
            res.status(500).send(err);
            return;
          }
          // Set pagination info in header..
          res.set('X-Pagination-Page', page);
          res.set('X-Pagination-Page-Size', pagesize);
          res.set('X-Pagination-Total', totalCount);
          res.set('X-Pagination-Filtered-Total', filteredCount);
          // Send query..
            User.find(criteria)
              .sort('name')
              .skip(offset)
              .limit(limit)
              .exec(function(err, User){
                if (err) {
                  res.status(500).send(err);
                  return;
                }
                res.send(User);
              });
          });
      });
});

// GET /api/users/:id
router.get('/:id', function(req, res, next) {
  var userId = req.params.id;
  User.findById(userId, function(err, user){
    if (err) {
      res.status(500).send(err);
      return;
    } else if (!user) {
      res.status(404).send('User not found');
      return;
    }
    res.send(user);
  });
});

// PUT /api/users/:id
router.put('/:id',checkUserExists, function(req, res, next) {
  var userId = req.params.id;
  User.findById(userId, function(err, user){
    if(err) {
      res.status(500).send(err);
      return;
    } else if (!user) {
      res.status(404).send('User not found');
      return;
    }
    user.name = req.body.name;
    user.login = req.body.login;
    user.password = req.body.password;
    user.email = req.body.email;
    user.telephone = req.body.telephone;
    user.city = req.body.city;
    // Save User...
    user.save(function(err, updatedUser) {
      if(err) {
        res.status(500).send(err);
        return;
      }
    res.send(updatedUser);
    });
  });
});



// DELETE /api/users/:id
router.delete('/:id',checkUserExists, function(req, res, next) {
  var userId = req.params.id;
  // TO DO : User.findById(userId, )
  User.remove({
    _id: userId
  },
  function(err, data) {
    if (err) {
        res.status(500).send(err);
        return;
    }
    console.log('Deleted ' + data + ' documents.');
    res.send(204);
  });
});