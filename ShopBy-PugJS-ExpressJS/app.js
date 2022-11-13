const express=require('express')
const app=express();
const fs=require('fs')
const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')
const fileuploader=require('express-fileupload');
const path=require('path')
// const logo=fs.readFileSync(__dirname+'/public/logo.png');
// let homehtm=fs.readFileSync(__dirname+'/templates/HTML/home.html');

const products=JSON.parse(fs.readFileSync('./products.json'));
// let post=fs.readFileSync(__dirname+'/templates/HTML/addProduct.html');
// let baskethtm=fs.readFileSync(__dirname+'/templates/HTML/basket.html')
// let selectedprods='';

// app.use
app.use(fileuploader())
app.use(express.static(__dirname+'/public'))
app.use(express.static(__dirname+'/templates/'))
app.use(express.static(__dirname+'/templates/HTML/'))
app.use(cookieParser())
app.set('view engine','pug')
app.set("views",path.join(__dirname,"/templates/Views"))
app.get('/',(req,res,next)=>{
    // homehtm=homehtm.toString().replace('{%products%}',show_products())
    // res.end(homehtm) 
    res.render("home",{products})
    next();
})
app.get('/addproduct',(req,res,next)=>{
    res.render("addProduct")
    next();
})
app.get('/addtobasket/:id',(req,res,next)=>{
    let query=req.params.id;
    if(req.cookies.basketitemselected){
        let basket=JSON.parse(req.cookies.basketitemselected)
        basket.push(products[parseInt(query)-1]);
        res.cookie(`basketitemselected`,`${JSON.stringify(basket)}`,{maxAge: 90000000, httpOnly: true, secure: false, overwrite: true})
    }
    else{
        res.cookie(`basketitemselected`,`${JSON.stringify([products[parseInt(query)-1]])}`,{maxAge: 90000000, httpOnly: true, secure: false, overwrite: true})
    }
    res.redirect('/basket')
    next();

})
app.get('/basket',(req,res,next)=>{
    let query=req.cookies.basketitemselected;
    if(JSON.parse(query)!=null){
        let sproducts=[];
        sproducts=JSON.parse(query);
        console.log(sproducts.length)
        // baskethtm=baskethtm.toString().replace('{%selectedproducts%}',show_basket_products(JSON.parse(query)))
        res.render("basket",{sproducts})
    }
    else{
        let sproducts=null;
        res.render("basket",{sproducts})
    }
    next();
})
app.get('/deletefrombasket/:id',(req,res,next)=>{
    let query=req.params.id;
    let data=JSON.parse(req.cookies.basketitemselected);
    let newdata=[];
    console.log('delete from basket Request from item Nº:'+query)
    for(let i=0;i<data.length;i++){
        if(data[i].id==query){
            console.log('finded')
        }
        else{
            newdata.push(data[i])
        }
    }
    // newdata=data;
    // newdata.remove(newdata[parseInt(query)])
    res.cookie(`basketitemselected`,`${JSON.stringify(newdata)}`,{maxAge: 90000000, httpOnly: true, secure: false, overwrite: true})
    res.redirect('/basket')
    next();
})
app.post('/postproduct',(req,res,next)=>{
    
    console.log(req.body)
    if(!req.files){
        return res.status(400).send("No files were uploaded.");
    }
    else{
        let image=req.files.imageproduct;
        image.mv(__dirname+'/public/images/'+image.name)
        if(req.body){
            let query={
                id:(products.length+1)
                ,image:('/images/'+image.name),
                name:req.body.name,
                price:parseInt(req.body.price),
                desc:req.body.desc
            }
            products.push(query)
            fs.writeFileSync('./products.json',JSON.stringify(products))
        }
        else{
            return res.status(400).send("Not Enough Informations");
        }

    }
    res.redirect('/addproduct')
    next();
})
app.get('/description/:id',(req,res,next)=>{
    if(req.params){
        let data=products[parseInt(req.params.id)-1]
        res.render("detailproduct",{data:data})
    }
    else{
        res.end("not fond")
    }
})
app.listen(3333,()=>{
    console.log('listening')
})