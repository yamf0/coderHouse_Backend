const express = require("express")
const productContainer = require("../../utils/productos")

const { Router } = express

const router = Router()

router.get("/", (req, res)=>{
    res.send("hi")
})

router.get("/productos", (req, res)=>{
    const productos = productContainer.getAll()
    if(!productos){
        res.status(500).send({"Error": "No Products available"}).end()
        return
    }

    return res.send(productos)
})

router.post("/productos", (req, res)=> {
    const producto = req.body
    const newProd = productContainer.add(producto)

    if(!newProd){
        res.json({Error: "Product couldnt be added"}).status(500)
        return
    }
    return res.json({message: "Product Added", id: newProd.id})

})

router.get("/productos/:id", (req, res)=> {
    const id = parseInt(req.params.id)

    const producto = productContainer.get(id)

    if(!producto){
        return res.json({error: "Product not found"}).status(204);
    }
    return res.send(producto)
})

router.put("/productos/:id", (req, res)=> {
    const id = parseInt(req.params.id)
    const product = req.body

    const updatedProd = productContainer.update(id, product)

    if(!updatedProd){
        
        return res.json({error: "Product not found"}).status(204);
        
    }

    return res.json({"message": "Product updated"})

})
router.delete("/productos/:id", (req, res)=> {
    const id = parseInt(req.params.id)

    const delProd = productContainer.remove(id)

    if(delProd.length == 0){
        return res.json({error: "Product not found"}).status(204);
    }

    return res.send(delProd)

})
module.exports = router