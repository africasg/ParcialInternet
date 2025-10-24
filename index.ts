import express from "express";
import cors from "cors";
import axios from "axios";


const app = express();
const port = 3000;

app.use(express.json())
app.use(cors())

type LD = {
id: number
filmName: string
rotationType: "CAV" | "CLV" 
region: string
lengthMinutes: number
videoFormat: "NTSC" | "PAL"
}

let discos :LD[] = [
  { id: 1, filmName: "El Viaje de Chihiro", rotationType:"CAV", region:"Japon",lengthMinutes:135, videoFormat:"PAL"},
  { id: 2, filmName: "El Castillo Ambulante", rotationType:"CLV", region:"Japon",lengthMinutes:200, videoFormat:"NTSC"},
];

app.get("/ld",(req,res)=>{
    res.json(discos);
})

app.get("/ld/:id", (req,res)=>{
   const realID : number = Number(req.params.id); 
    const disco = discos.find((n) => realID === n.id)
    disco ? res.status(200).json(disco) : res.status(404).json({
        message: "Disco no encontrado"
    })
});

app.post("/ld",(req,res)=>{
    const newID : number = Date.now(); //creación de un id único 
     const newLd: LD = {
      ...req.body, 
      id: newID,
    };
        discos.push(newLd);
        res.status(201).json(newLd);
})

app.delete("/ld/:id", (req,res)=>{
    const existe = discos.some((elem)=>{
        if(elem.id==Number(req.params.id)){
            return true
        }else{
        return false
        }
    })
   if(existe){
    discos=discos.filter((elem)=>elem.id!==Number(req.params.id))
       res.status(203).send("Disco eliminado")
   } else {
    res.status(404).send("Este disco no existe")
   }
})
app.listen(3000, () => console.log("Servidor en http://localhost:3000"));

const testAPI= async() => {
    const miPromesaGet1 = (await (axios.get<LD[]>("http://localhost:3000/ld"))).data
    console.log(miPromesaGet1);


    const creacion : LD = {
        id: 0,
        filmName: "Lost in Translation",
        rotationType: "CAV" ,
        region: "USA",
        lengthMinutes: 99,
        videoFormat: "PAL"
    }

    axios.post("http://localhost:3000/ld", creacion);

    const miPromesaGet2 = (await (axios.get<LD[]>("http://localhost:3000/ld"))).data
    console.log(miPromesaGet2);

    //eliminado
// const disco: LD | undefined =miPromesa2.find((n)=> miNuevoDisco.filmName === n.filmName && miNuevoDisco.lengthMinutes === miNuevoDisco.lengthMinutes) 
//     let idDiscoElim : number;
//     disco ? idDiscoElim = disco.id : idDiscoElim = 0;
//     axios.delete(`http://localhost:3000/ld/${idDiscoElim}`)
//     const miPromesa3 = (await(axios.get<LD[]>(`http://localhost:3000/ld`))).data
    const ldAEliminar : LD | undefined = miPromesaGet2.find((n)=> creacion.filmName===n.filmName && creacion.region=== n.region && creacion.lengthMinutes=== n.lengthMinutes )
    let idEliminado : number = 0 ;
    ldAEliminar ? idEliminado = ldAEliminar.id : console.log("No se ha encontrado el id del disco");

    axios.delete(`http://localhost:3000/ld/${idEliminado}`)
    

    const miPromesaGet3 = (await(axios.get<LD[]>("http://localhost:3000/ld"))).data
    console.log(miPromesaGet3);
    
}
setTimeout((testAPI), 1000); 