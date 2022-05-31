let randoms = {}

function generateNumber() {  
    return Math.floor(
      Math.random() * (1000 - 0) + 0
    )
}


process.on("message", (msg) =>{
    console.log(`count ${msg} numbers`)

    for(let i=0; i < msg; i++){
        if(i%1000000 == 0 ) console.log(`count at ${i}`)
        let num = generateNumber()
        if(randoms[num]){
            randoms[num] += 1
        }
        else{
            randoms[num] = 1
        }
    }   
    process.send(randoms)
})