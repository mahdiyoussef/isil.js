const express=require('express')
const path=require("path")
const app=express();
const body_parser=require('body-parser');
const cookie_parser=require('cookie-parser')
const url=require('url')
// const { posts,addpost } = require('./posts');
app.set("views",path.join(__dirname,"views"))
app.set('view engine','pug')
app.use(express.static(path.join(__dirname,"public")))
app.use(body_parser.json())
app.use(cookie_parser())
app.use(body_parser.urlencoded({extended:false}))
const fs=require('fs')
let posts=JSON.parse(fs.readFileSync('./posts.json'))
let users=[]
let empty=false;
try{
    users=JSON.parse(fs.readFileSync('./users.json'))
}
catch(e){
    empty=true;
    console.log('eror json empty')
}

app.get('/',(req,res,next)=>{
    // console.log(req.cookies)
    // res.render("index",{posts})
    // console.log(JSON.stringify(req.body))
    try{
        if(req.cookies.user) res.render("index",{posts});
        else res.redirect('/loginandsignin');
    }
    catch(e){
        res.redirect('/loginandsignin')
    }
    next()
})
app.get('/post',(req,res,next)=>{
    res.render("post")

})
app.post('/post',(req,res,next)=>{
    let d=req.body
    // res.render("post",{title:'post an article'})
    if(req.body==null || req.body.title=='' || req.body.image=='' || req
    .body.details==''){
        res.end('incomplete form')
    }
    else{

        console.log(d);
        let query={
            id:(posts.length+1),
            title:d.title,
            image:d.image,
            desc:d.details.slice(0,160),
            detail:d.details
        }
        posts.push(query)
        fs.writeFileSync('./posts.json',JSON.stringify(posts),()=>{
            console.log('added')
        })
        res.redirect(url.format({
            pathname:'/post'
        }))
    }
    next();
})
app.get('/deletepost/:id',(req,res,next)=>{
    let id=parseInt(req.params.id)
    let arr=[]
    for(let i=0;i<posts.length;i++){
        if(posts[i].id==id){

        }
        else{
            arr.push(posts[i])
        }
    }
    for(let i=0;i<arr.length;i++){
        posts[i].id=i+1;
    }
    fs.writeFileSync('./posts.json',JSON.stringify(arr),()=>{
        console.log('added')
    })
    res.redirect(url.format({
        pathname:'/'
    }))
    next();
})
app.get('/loginandsignin',(req,res,next)=>{
    res.render("user")
})
app.post('/signin',(req,res,next)=>{
    let query=req.body;
    let id;
    if(query.pwd1==query.pwd2){
        if(empty) id=1;
        else id=users.length+1;
        users.push({
            id:id,
            user:query.user,
            pwd:query.pwd1
        })
        fs.writeFileSync('./users.json',JSON.stringify(users))
        res.redirect('/loginandsignin')
    }
    else{
        res.send('passwords are incorrect')
    }
    next();
})
const userverification=(usr,pswd)=>{
    // console.log(user+pwd)
    console.log('user:'+usr)
    console.log('pwd:'+pswd)
    let data=JSON.parse(fs.readFileSync('./users.json'));
    console.log(data)
    let status=false;
    data.map((u)=>{

        console.log("current :"+u.user)
        if(u.user==usr){
            console.log("current :"+u.pwd)
            if(u.pwd==pswd){
                console.log("detect");
                status= true
                
            }
            else{
                console.log('correct pwd'+u.pwd)
                status= false
            }
        }
        console.log("current :"+u.user)
        console.log(usr)
    })
    return status;
}
app.post('/login',(req,res,next)=>{
   
    let rq=req.body;
    console.log(JSON.stringify(req.body))
    if(userverification(rq.user,rq.pwd)){
        res.cookie(`user`,`${rq.user}`)
        res.redirect('/')
    }
    else{
        res.send('incorrect infos')
    }
    next();
})
app.get('/posts/:id',(req,res,next)=>{
    if(req.params){
        res.render("fullpost",{data:posts[parseInt(req.params.id)-1]})
    }
    else{
        res.end("page not found")
    }
    next()
})
app.get('/logout',(req,res,next)=>{
    res.clearCookie('user')
    res.redirect('/')
})
app.listen(3000,()=>{
    console.log('hello')
}) 
