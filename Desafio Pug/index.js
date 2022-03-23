const express = require("express");
const path = require("path")
const handlebars = require('pug');
const productContainer = require("./utils/productos");
const bodyParser = require('body-parser');


const app = express()
const port = 8080;

app.set("views", path.join(__dirname, 'views'))
app.set('view engine', 'pug');

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.render("main")
})


//AQUI LAS RUTAS PARA LOS PRODUCTOS
app.get("/productos", (req, res)=>{
    const productos = productContainer.getAll()
    if(productos.length == 0){
        return res.render("productos", {listExists: false})
        
    }

    return res.render("productos", {array: productos, listExists: true})
})

app.post("/productos", (req, res)=> {
    const producto = req.body
    const newProd = productContainer.add(producto)

    if(!newProd){

        res.json({Error: "Product couldnt be added"}).status(500)
        return
    }
    return res.redirect("/")

})

app.listen(port, () => console.log(`App listening to port ${port}`));