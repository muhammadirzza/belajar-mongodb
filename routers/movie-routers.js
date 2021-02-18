const express=require('express')
const { movieControllers }=require('../controllers')
const router=express.Router()

router.get('/getallmovies', movieControllers.getmovies)
router.post('/postmovies', movieControllers.addmovies)
router.delete('/deletemovies/:id', movieControllers.deletemovies)
router.put('/editmovies/:id', movieControllers.editmovies)


module.exports=router