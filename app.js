const express = require('express')
const { ObjectId } = require('mongodb')
const { connectToDb, getDb } = require('./db')

//init app
const app = express()
app.use(express.json())

//db connection 
let db 

connectToDb((err) => {
    if (!err) {
        app.listen(3000, () => {
            console.log('app is listening on port 3000')
        })  
        db = getDb()      
    }
})

//routes
app.get('/ToWatch', (req, res) => {

    //Pagination
    const page = req.query.p || 0 //Take page query or default page 0
    const mediaPerPage = 3

    let list = []

    db.collection('ToWatch')
        .find()
        .sort({ author: 1 })
        .skip(page * mediaPerPage)
        .limit(mediaPerPage)
        .forEach(media => list.push(media))
        .then(() => {
            res.status(200).json(list)
        })
        .catch(() => {
            res.status(500).json({error: 'Could not fetch the documents'})
        })
})

app.get('/ToWatch/:id', (req, res) => {

    if(ObjectId.isValid(req.params.id)) {

        db.collection('ToWatch')
            .findOne({_id: new ObjectId(req.params.id)})
            .then(doc => {
                res.status(200).json(doc)
            })
            .catch(err => {
                res.status(500).json({error: 'Could not fetch the document'})
            })

    } else {
        res.status(500).json({error: 'Not a valid doc id'})
    }

})

app.post('/ToWatch', (req, res) => {
    const media = req.body

    db.collection('ToWatch')
        .insertOne(media)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({err: 'Could not create a new document'})
        })
})

app.delete('/ToWatch/:id', (req, res) => {

    if(ObjectId.isValid(req.params.id)) {
        
        db.collection('ToWatch')
            .deleteOne({_id: new ObjectId(req.params.id)})
            .then(result => {
                res.status(202).json(result)
            })
            .catch(err => {
                res.status(500).json({error: 'Could not delete the document'})
            })
    } else {
        res.status(500).json({error: 'Not a valid doc id'})
    }
})

app.patch('/ToWatch/:id', (req, res) => {

    const updates = req.body

    if(ObjectId.isValid(req.params.id)) {
        
        db.collection('ToWatch')
            .updateOne({_id: new ObjectId(req.params.id)}, {$set: updates})
            .then(result => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({error: 'Could not update the document'})
            })
    } else {
        res.status(500).json({error: 'Not a valid doc id'})
    }
})