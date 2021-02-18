const {mongodb} = require('../connections')
const {MongoClient, ObjectID, url} = mongodb
const database='mydb'       //nama database
const collection='movies'   //nama collection

MongoClient.connect(url, {useUnifiedTopology:true}, (err,client)=>{        //cek koneksi
    if(err) console.log(err)
    console.log('terhubung ke mongodb')
    client.close()
})

module.exports={
    getmovies:(req,res)=>{
        MongoClient.connect(url, {useUnifiedTopology:true}, (err,client)=>{ //cek koneksi
            var title
            if(!req.query.title){       //jika kita tidak masukkan title yang dicari, maka tampilkan semua movies
                title={}
            }else{
                title={title:{'$regex':req.query.title, '$options':'i'}}    //kalau ada tampilkan movies yang mengandung judul yang kita cari
            }                                                               //options : i = case sensitivenya tidak ada
            if(err) console.log(err)
            var movies=client.db(database).collection(collection)
            movies.find(title).limit(20).toArray((err,result)=>{       //object kosong sama dengan find all
                client.close()
                if(err) res.status.send(err)
                res.status(200).send(result)
            })
        })
    },

    addmovies:(req,res)=>{
        MongoClient.connect(url, {useUnifiedTopology:true}, (err,client)=>{
            var movies=client.db(database).collection(collection)
            movies.insertMany(req.body.data, (err1,result1)=>{      //insertMany bisa input satu data ataupun banyak data
                client.close()                                      //saat insert akan mendapatkan objectID
                if(err1) res.status.send(err1)
                res.status(200).send(result1)
            })
        })
    },
    deletemovies:(req,res)=>{
        MongoClient.connect(url, {useUnifiedTopology:true}, (err,client)=>{
            var movie=client.db(database).collection(collection)
            movie.deleteOne({_id: new ObjectID(req.params.id)},(err,result)=>{
                client.close()                                                  
                if(err) res.status.send(err)
                res.status(200).send(result)
            })
        })
    },
    editmovies:(req,res)=>{
        if(!req.body.unset){    //unset untuk menhapus fieldnya, dalam syntax ini jika unsetnya tidak ada maka unset field "tesmovie"
            req.body.unset={"tesmovie":""}
        }
        MongoClient.connect(url, {useUnifiedTopology:true}, (err,client)=>{
            var movie=client.db(database).collection(collection)
            movie.deleteOne({_id: new ObjectID(req.params.id)},{$set:req.body.set, $unset:req.body.unset},(err,result)=>{      //parameter pertama itu querynya, paramter kedua data apa yang mau kita edit
                client.close()
                if(err) res.status.send(err)
                res.status(200).send(result)
            })
        })
    },
}