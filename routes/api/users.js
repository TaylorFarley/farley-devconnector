const express = require('express')
const router = new express.Router()
const User = require('../../models/User')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {
    check,
    validationResult
} = require('express-validator')


//@route  GET api/users
//@desc   test route
//@access public
router.post('/', [
        //this is using line 6 for validation, middleware
        check('name', 'name is required').not().isEmpty(),
        check('email', 'not an email').isEmail(),
        check('password', 'must be greater than 6').isLength({
            min: 6
        })
    ],

    //main processes
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        //getting the name email and password from req body. not needed just a deconstructor for easy access
        const {
            name,
            email,
            password
        } = req.body

        //starting to see if the user exists, uing promises so we do try catch
        try {
            let user = await User.findOne({
                email
            })
            if (user) {
              return res.status(400).send('user found already')
            }

            //above checks if user exists, if it doesnt then below goes ok, lets give them a gravatar using the gravatar
                        const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })
            
            //now lets create an instance, user is new user pass all the shit above
            user = new User({
                name,
                email,
                avatar,
                password
            })

            //encryptuing the password with bcrypt
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(password, salt)

            //finally saving

            await user.save()


            //ok lets create a jwt for our users right away
            //first start with the payload
            const payload = 
            {
                user: {
                    id: user.id
                }
            }

            //sign it, this is adding the payload, getting your secret from your config/defaultjson using the 
            //module config, setting expiry (optional), checking for errro adn if no error send the token

                jwt.sign(
                    payload, 
                    config.get('jwtSecret'),
                    { expiresIn: 360000},
                    (err,token)=>{
                            if(err) throw err
                            res.json({ token })
                    }
                    )
           


        } catch (error) {
            console.error(error.message)
            res.status(500).send('server error:(')
        }


    })



module.exports = router