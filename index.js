const express=require('express')
const bodyParser=require('body-parser')
const app=express()


const PORT=5000
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static('public'))

const { movieRouters } =require('./routers')

app.get('/',(req, res)=>{
    return res.send('<h1>Belajar MongoDB Node JS</h1>')
})

app.use('/movies',movieRouters)


app.listen(PORT, ()=>console.log('server jalan di '+PORT))
