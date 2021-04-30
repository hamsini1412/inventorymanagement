var express=require('express');
var app=express()
const bodyParser=require('body-parser')
const MongoClient=require('mongodb').MongoClient;
//const { parse } = require('node:path');

var db;
var s;
MongoClient.connect('mongodb://localhost:27017/inventory',{ useUnifiedTopology:true },(err,database)=>{
    if (err) return console.log(err)
    db=database.db('inventory')
    app.listen(8005,()=>{
        console.log('listening running at 5000')
    })
})
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/',(req,res)=>{
    db.collection('stock').find().toArray((err,result)=>{
      if (err) return console.log(err)
      res.render('homepage.ejs',{data:result})  
    })
})



app.get('/create',(req,res)=>{
    res.render('add.ejs')
})

app.get('/salesdetails',(req,res)=>{
    db.collection('sales').find().toArray((err,result)=>{
        if (err) return console.log(err)
        res.render('salesdetails.ejs',{data:result})  
})
})

var pid;
console.log("iam here")
app.post('/updatestock',(req,res)=>{
 pid=req.body;
 console.log(pid)

    res.render('update.ejs',{data:pid})
})


app.post('/adddata',(req,res)=>{
    db.collection('stock').find().toArray((err,result)=>{
        if (err) return console.log(err)
        console.log("iam adding")
      
    for(var i=0;i<result.length;i++){
        if(result[i].productid===req.body.productid){
            s=result[i].quantity
            prompt("id already exist")
            break
        }
    }
})
    
    db.collection('stock').save(req.body,(err,result)=>{
        if (err) return console.log(err)
        res.redirect('/')
    })
})

app.post('/updatedata',(req,res)=>{
    db.collection('stock').find().toArray((err,result)=>{
        if (err) return console.log(err)
        pid=req.body.productid
        // console.log("iam in updatedata serverjs ")
        // console.log(pid)
        for(var i=0;i<result.length;i++){
            if(result[i].productid===req.body.productid){
                s=result[i].quantity
                break
            }
        }
        db.collection('stock').findOneAndUpdate({productid:req.body.productid},{
            $set: {quantity:parseInt(s)+parseInt(req.body.quantity)}},{sort: {_id: -1}},
            (err,result)=>{
                if (err)
                return res.send(err)
                console.log(req.body.productid+' stock updated')
                res.redirect('/')
            
        })
    })
})

app.get('/add',(req,res)=>{
    res.render('addsales.ejs')
})

app.post('/deletedata',(req,res)=>{
    
        db.collection('stock').findOneAndDelete({productid:req.body.productid},(err,result)=>{

        if (err)
        return res.send(err);
        console.log('stock deleted')
        res.redirect('/')
        })
    })

    app.post('/addsales',(req,res)=>{
        
          
        console.log(req.body)
        
          
        
        
        db.collection('sales').save(req.body,(err,result)=>{
            if (err) return console.log(err)

            

        })
        
        res.redirect('/salesdetails')
       
    })

        
var q;
    app.post('/updatesales',(req,res)=>{
        db.collection('sales').find().toArray((err,result)=>{
            if (err) return console.log(err)
            pid=req.body.productid
            // console.log("iam in updatedata serverjs ")
            // console.log(pid)
            for(var i=0;i<result.length;i++){
                if(result[i].productid===req.body.productid){
                    s=result[i].quantity
                    q=result[i].total_sales
                    break
                }
            }
            console.log(req.body)
            db.collection('sales').findOneAndUpdate({productid:req.body.productid},{
                $set: {quantity:parseInt(s)+parseInt(req.body.quantity)}},{sort: {_id: -1}},
                (err,result)=>{
                    if (err)
                    return res.send(err)
                    console.log(req.body.productid+' stock updated')
                    
                
            })
            db.collection('sales').findOneAndUpdate({productid:req.body.productid},{
                $set: {total_sales:parseInt(q)+parseInt(req.body.total_sales)}},{sort: {_id: -1}},
                (err,result)=>{
                    if (err)
                    return res.send(err)
                    console.log(req.body.productid+' stock updated')
                    
                
            })
        })
        res.redirect('/salesdetails')
    })


    app.post('/update',(req,res)=>{
        console.log(req.body)
        res.render('updatesales.ejs',{data:req.body})
    })