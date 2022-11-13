const express=require('express')
const app=express();
const fs=require('fs')
const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')
const fileuploader=require('express-fileupload');
const logo=fs.readFileSync(__dirname+'/public/logo.png');
let homehtm=fs.readFileSync(__dirname+'/templates/HTML/home.html');

const products=JSON.parse(fs.readFileSync('./products.json'));
let post=fs.readFileSync(__dirname+'/templates/HTML/addProduct.html');
let baskethtm=fs.readFileSync(__dirname+'/templates/HTML/basket.html')
// let selectedprods='';

// app.use
app.use(fileuploader())
app.use(express.static(__dirname+'/public'))
app.use(express.static(__dirname+'/templates/'))
app.use(express.static(__dirname+'/templates/HTML/'))
app.use(cookieParser())

app.get('/',(req,res,next)=>{
    homehtm=homehtm.toString().replace('{%products%}',show_products())
    res.end(homehtm)
})
app.get('/addproduct',(req,res,next)=>{
    res.end(post)
})
app.get('/addtobasket/:id',(req,res,next)=>{
    let query=req.params.id;
    if(req.cookies.basketitem){
        let basket=JSON.parse(req.cookies.basketitem)
        basket.push(products[parseInt(query)-1]);
        res.cookie(`basketitem`,`${JSON.stringify(basket)}`,{maxAge: 90000000, httpOnly: true, secure: false, overwrite: true})
    }
    else{
        res.cookie(`basketitem`,`${JSON.stringify([products[parseInt(query)-1]])}`,{maxAge: 90000000, httpOnly: true, secure: false, overwrite: true})
    }
    res.redirect('/basket');
    next();

})
app.get('/basket',(req,res,next)=>{
    let query=req.cookies.basketitem
    if(query!=null){
        baskethtm=baskethtm.toString().replace('{%selectedproducts%}',show_basket_products(JSON.parse(query)))
    }
    baskethtm=baskethtm.toString().replace('{%selectedproducts%}','')
    res.end(baskethtm)
})
app.get('/deletefrombasket/:id',(req,res,next)=>{
    let query=req.params.id;
    let data=JSON.parse(req.cookies.basketitem);
    let newdata=[];
    console.log('delete from basket Request from item Nº:'+query)
    // for(let i=0;i<data.length;i++){
    //     if(i==query){
    //         console.log('finded')
    //     }
    //     else{
    //         newdata.push(data[i])
    //     }
    // }
    newdata=data;
    newdata.remove(newdata[parseInt(query)])
    res.cookie(`basketitem`,`${JSON.stringify(newdata)}`,{maxAge: 90000000, httpOnly: true, secure: false, overwrite: true})
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
                price:parseInt(req.body.price)
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
app.listen(3333,()=>{
    console.log('listening')
})
// replacing function
const show_basket_products=(products)=>{
    let prods='';
    let ps='';
    products.map((p,n)=>{
        ps=`
            <div class='products-panel'>
                <div>
                    <div id='title-products' >${p.name}</div>
                    <div id='product-price'>${p.price}$</div>
                </div>
                <a href="/deletefrombasket/${n}">
                    <div class='deletebutton'>
                        delete
                    </div>
                </a>
            </div>
        `
        prods+=(ps).toString()
    })
    return prods
}
const show_products=()=>{
    let prods='';
    let ps='';
    products.map((p)=>{
        ps=`
            <div class='products-panel'>
                <div  style="background-image:url(${p.image})" class='image-product'></div>
                <div id='title-products' >${p.name}</div>
                <div id='product-price'>${p.price}$</div>
                <a href=${'http://localhost:3333/addtobasket/'+p.id}><button value=${p.id} id=${p.id} class="btn-addtobasket">Add to Cart</button></a>
            </div>
        `
        prods+=(ps).toString()
    })
    return prods
}