const container = document.querySelector('.container');
const idPelicula = document.querySelector('#idPelicula');
const inputTitulo = document.querySelector('#titulo');
const inputDirector = document.querySelector('#director');
const inputAnio = document.querySelector('#anio');
const btnEnviar = document.querySelector('#btnEnviar');
const formPelicula = document.querySelector('#annadirPeli');
const dialogConfirm = document.querySelector('dialog')
const btnAccept = document.querySelector("#accept");//Boton verde
const btnCancel = document.querySelector("#cancel");//Boton rojo
const btnCloseDialog = document.querySelector("#close-button-confirm");

document.addEventListener('DOMContentLoaded', () => {
    cargarPeliculas();
});

async function cargarPeliculas() {
    const response = await fetch('/peliculas');
    const peliculas = await response.json();
    console.log(peliculas);

    container.replaceChildren();

    peliculas.forEach( pelicula => {
        const div = document.createElement('div');
        div.classList.add('pelicula');//Tarjeta de la película

          const titulo = document.createElement('h3');
          titulo.classList.add('titulo');
          titulo.textContent = pelicula.titulo; //Titulo

          const info = document.createElement('div'); //Div con el info (director, anio)
          info.classList.add('info');

            const director = document.createElement('p'); //Director
            director.classList.add('director');
            director.textContent = `Director: ${pelicula.director}`;

            const anio = document.createElement('p');//Anio
            anio.classList.add('anio');
            anio.textContent = `Año: ${pelicula.anio}`;

        const botones = document.createElement('div');
        botones.classList.add('botones');

        //Crea el boton de eliminar
        const btnEliminar = document.createElement('button');
        const iconBorrar = document.createElement('i');// Crear el iconBorrar <i> manualmente
        iconBorrar.classList.add('fa-regular', 'fa-trash-can');
        btnEliminar.appendChild(iconBorrar);// Agregar el iconBorrar al botón
        btnEliminar.dataset.id = pelicula.id;
        btnEliminar.classList.add('eliminar');
        btnEliminar.addEventListener('click', async (e) => {
            e.preventDefault();
            /* eliminarPelicula(pelicula.id); */
            dialog(e);
        });

        //Crea el boton de editar
        const btnEditar = document.createElement('button');
        const iconEditar = document.createElement('i');// Crear el iconEditar <i> manualmente
        iconEditar.classList.add('fa-regular', 'fa-pen-to-square');
        btnEditar.appendChild(iconEditar);// Agregar el iconEditar al botón
        btnEditar.dataset.id=pelicula.id;
        btnEditar.classList.add('editar');
        btnEditar.addEventListener('click', (e) => {
            e.preventDefault();
            editarPelicula(pelicula.id);
        });

        botones.appendChild(btnEliminar);
        botones.appendChild(btnEditar);

        info.appendChild(director);
        info.appendChild(anio);

        div.appendChild(titulo);
        div.appendChild(info);
        div.appendChild(botones);

        container.appendChild(div);
    });
}

/* ----FUNCTION ELIMINAR PELICULA ---- */
async function eliminarPelicula(id) {
    const response = await fetch(`/eliminar-pelicula`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    const data = await response.json();
    if (data.success){
        cargarPeliculas();
    } else {
      console.error('Error al eliminar la pelicula');
    }
  }
  /* --------FUNCTION DIALOG CONFIRM ---- */
    function dialog(e) {
        e.preventDefault();
        const id = parseInt(e.currentTarget.dataset.id);
        dialogConfirm.dataset.taskId = id; // Guardamos el ID en el dataset del diálogo
        dialogConfirm.style.display = "flex";
        dialogConfirm.showModal();
    }

    btnCloseDialog.addEventListener("click", () => {
        dialogConfirm.close();
        dialogConfirm.style.display = "none";
    });

    btnCancel.addEventListener("click", () => {
        dialogConfirm.close();
        dialogConfirm.style.display = "none";
    });

    btnAccept.addEventListener("click", () => {
        const taskId = parseInt(dialogConfirm.dataset.taskId); // Leemos el ID del dataset
        eliminarPelicula(taskId);
        dialogConfirm.close();
        dialogConfirm.style.display = "none";
        showToast("Pelicula eliminada correctamente");//Llamo a la funcion que muestra el toast
    });

  /* ----FUNCTION EDITAR PELICULA ---- */
  async function editarPelicula(id) {
    const response = await fetch (`/peliculas`);
    const pelicula = await response.json();
    const peliculaEditar = pelicula.find(pelicula => pelicula.id === id);

    console.log(peliculaEditar);    

    inputTitulo.value = peliculaEditar.titulo;
    inputDirector.value = peliculaEditar.director;
    inputAnio.value = peliculaEditar.anio;
    idPelicula.value=id;

    formPelicula.action="/editar-pelicula";
    btnEnviar.textContent="Guardar Cambios";
}
/* ----FUNCTION TOAST ---- */
function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000); // Toast visible durante 3 segundos
}