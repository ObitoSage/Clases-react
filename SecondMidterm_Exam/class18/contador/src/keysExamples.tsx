export default function keysExamples(){
    const adition = (a:number,b:number):number =>{
        return a+b
    }
    const add = adition(3,4)
    const message: String = "Hello UPB"
    return (
        <section>
            <h1> {message} </h1>
            <p> 3+4 = {add}</p>
        </section>
    )
}