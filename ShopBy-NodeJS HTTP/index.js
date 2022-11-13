const http=require('http');
const fs=require('fs');
let home=fs.readFileSync(__dirname+'/templates/index.html');
let addprod=fs.readFileSync(__dirname+'/templates/addprod.html')
const dataprod=JSON.parse(fs.readFileSync(__dirname+'/products.json'));
const nodeStatic=require('node-static')
var fileServer = new nodeStatic.Server('./public');
const server=http.createServer((req,res)=>{
    fileServer.serve(req,res)
    if(req.url=='/'){
        home=home.toString().replace('{%products%}',show_products())
        res.end(home)
        
    }
    else if(req.url=='/addproduct'){
        res.end(addprod)
    }
    
    
})
const show_products=()=>{
    let pros='';
    dataprod.map((p)=>{
        pros+=(`
            <div class='product-panel'>
                <div class="product-image" style="background-image:url(${p.image})"></div>
                <div id="productname">${p.name}</div>
                <div id="productprice">${p.prix} $ </div>
            </div>
        `).toString()
    })
    return pros;
}
server.listen(3000,()=>{
    console.log("listen")
})