const router = require('express').Router()
const poll = require('../../config/db')
const {login, register, profile} = require('../../controllers/user/index');


router.post('/register', register);
router.post('/login', login);  
router.get('/profile', profile);  

module.exports  = router;