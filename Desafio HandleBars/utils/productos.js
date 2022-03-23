class Productos{
    static productosMap = []

    add(prod){
       
        Productos.productosMap.push(prod)
        return prod
    }

    getAll(){
        return Productos.productosMap
    }


}

module.exports = new Productos()


const p = new Productos()

p.add({Nombre: "Guitarra", Precio: 2000, Foto: "https://cdn-icons-png.flaticon.com/512/2892/2892202.png"})
p.add({Nombre: "Piano", Precio: 15000, Foto: "https://cdn-icons.flaticon.com/png/512/4311/premium/4311197.png?token=exp=1648002113~hmac=660046d5498b2ee733f754f2c685439c"})
