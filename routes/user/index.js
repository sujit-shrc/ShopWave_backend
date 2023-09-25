const router = require('express').Router()
const poll = require('../../config/db')
const {login, register, profile} = require('../../controllers/user/index');
const { forgetPassword, resetPassword } = require('../../controllers/user/resetPassword')

router.post('/register', register);
router.post('/login', login);  
router.get('/profile', profile);  
router.get('/forget-password', forgetPassword);
router.post('/reset-password', resetPassword);

module.exports  = router;