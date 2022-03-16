class Productos{
    static productosMap = []
    constructor(){
        console.log(Productos.productosMap)
    }

    add(prod){
        const id = Productos.productosMap.length + 1
        prod.id = id
        
        Productos.productosMap.push(prod)
        return prod
    }

    remove(id){
        const prodIdx = Productos.productosMap.findIndex(element => element.id === id)
        const delprod = Productos.productosMap.splice(prodIdx, 1) 
        
        return delprod
    }

    get(id){
        const prod = Productos.productosMap.find((elem) => elem.id === id)
        return prod
    }

    getAll(){
        return Productos.productosMap
    }

    update(id, newProd){
        let updated = false
        Productos.productosMap.forEach((elem, idx) => {
            if(elem.id === id){
                newProd.id = id
                Productos.productosMap[idx] = newProd
                updated = true
            }
            
        })
        if(updated){
            return newProd
        }
        return 0
    }

}

module.exports = new Productos()


const p = new Productos()

p.add({'q': 12})
console.log(p.get(1))
console.log(p.update(1, {
    "title": "La sirenita",
    "price": 123,
    "url": "www.myn.com"
}))
