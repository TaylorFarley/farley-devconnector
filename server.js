const express = require('express')
const connectDB = require('./config/db')

const app = express()

connectDB()

//init middleware
//how you get req.body in your routes to show up 
app.use(express.json({extended: false}))


app.get('/', (req,res) =>{
    res.send('api running')
})


//Define Routes

app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))

const port = 3000 || process.env.PORT
app.listen(port, ()=>{
    console.log('WE ARE GOING BUDDY')
})