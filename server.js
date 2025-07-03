import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
const PORT = 3000;

//Middlewares para parsear
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//Cargar la carpeta pública 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

const peliculas = [
    { id: Date.now(),titulo: 'El Padrino',director: 'Francis Ford Coppola', anio: 1972},
    { id: Date.now() + 1,titulo: 'Pulp Fiction',director: 'Quentin Tarantino',anio: 1994},
    {id: Date.now() + 2,titulo: 'Parásitos',director: 'Bong Joon-ho', anio: 2019}
];
app.get('/peliculas', (req, res) => {
    res.json(peliculas);
  });

app.post('/anadir-pelicula', (req, res) => {
    const { titulo, director, anio } = req.body;
    const nuevaPelicula = {
        id: Date.now(), // ID único basado en la fecha actual
        titulo,
        director,
        anio
    };

    peliculas.push(nuevaPelicula);
    res.redirect('/');
});

app.delete('/eliminar-pelicula', (req, res) => {
    const {id} = req.body;
    //busca la pelicula por su id y me devuelve la posición, si no lo encuentra devuelve -1
    const index = peliculas.findIndex(pelicula => pelicula.id === parseInt(id));
    if (index !== -1) {
        peliculas.splice(index, 1); // Elimina la pelicula del array
        res.json({success:true}) //envía una respuesta en formato JSON con un mensaje de éxito
    } else {
        res.status(404).json({ error:`Pelicula con id ${id} no encontrado` });
    }
});

app.post('/editar-pelicula', (req, res) => {
    const { idPelicula, titulo, director, anio } = req.body;
    const index =peliculas.findIndex(pelicula => pelicula.id === parseInt(idPelicula));
    if (index !== -1) {
        peliculas[index].titulo = titulo;
        peliculas[index].director = director;
        peliculas[index].anio = anio;
        res.redirect('/');
    } else{
      res.status(404).json({ error:`Pelicula con id ${idPelicula} no encontrado` });
    }
});

//Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
});
