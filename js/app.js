// ******* SELECTORES *******

// Div donde se inyectan los resultados
const resultado = document.querySelector("#resultado");

// Creamos un nuevo modal en el div con id modal
const modal = new bootstrap.Modal("#modal", {});

// ******* EVENT LISTENERS *******

// Al cargar el documento, llamamos la funcion que inicia la app
document.addEventListener("DOMContentLoaded", iniciarApp);

// ******* FUNCIONES *******

// Inicia la app al cargar el DOM
function iniciarApp() {
  // Seleccionamos el select con las categorias
  const selectCategorias = document.querySelector("#categorias");

  // Si ya existe...
  if (selectCategorias) {
    // Añadimos el evento cuando cambia el select y lanzamos la funcion
    selectCategorias.addEventListener("change", seleccionarCategoria);
    
    // Llamamos la funcion que trae las categorias
    obtenerCategorias();
  }

  // Seleccionamos el div con la clase de favoritos (de favoritos.html)
  const favoritosDiv = document.querySelector('.favoritos')

  // Si existe, usamos la funcion para traer los favoritos de LS
  if (favoritosDiv) {
    obtenerFavoritos()
  }

  // ******************************************************************

  // Definimos funcion para obtener las categorías
  function obtenerCategorias() {
    const url = "https://www.themealdb.com/api/json/v1/1/categories.php";
    fetch(url)
      .then((response) => response.json())
      .then((resolve) => mostrarCategorias(resolve.categories));
  }

  // ******************************************************************
  // Definimos funcion para mostrar las categorías en el select
  function mostrarCategorias(categorias = []) {
    // Recorremos el array que recibimos de la respuesta del fetch y al que llamamos "categorias"
    categorias.forEach((categoria) => {
      // Extraemos el key "strCategory" de cada elemento del array
      const { strCategory } = categoria;
      // Creamos cada option para el select
      const option = document.createElement("option");
      // Añadimos el valor a cada option
      option.value = strCategory;
      // Añadimos el texto
      option.textContent = strCategory;
      // Añadimos cada option al select de las categorias
      selectCategorias.appendChild(option);
    });
  }

  // ******************************************************************
  // Definimos funcion para mostrar las recetas según categoría
  function seleccionarCategoria(e) {
    const categoria = e.target.value;
    const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;

    fetch(url)
      .then((response) => response.json())
      .then((resolve) => mostrarRecetas(resolve.meals));
  }

  // ******************************************************************
  // Definimos funcion para mostrar las recetas
  function mostrarRecetas(recetas = []) {
    // Limpiamos resultados previos
    limpiarHTML(resultado);

    // Creamos el heading con condicional si existen o no resultados del fetch
    const heading = document.createElement("h2");
    heading.classList.add("text-center", "text-black", "my-5");
    heading.textContent = recetas.length ? "Recipes" : "No recipes";

    // Añadimos el heading al resultado
    resultado.appendChild(heading);

    // Recorremos las recetas que recibimos del fetch al seleccionar una categoria
    recetas.forEach((receta) => {
      // Extraemos de cada receta
      const { idMeal, strMeal, strMealThumb } = receta;
      // Creamos un contenedor y le añadimos la clase
      const recetaContenedor = document.createElement("DIV");
      recetaContenedor.classList.add("col-md-4");

      // Creamos el card que va a contener cada receta y le añadimos las clases
      const recetaCard = document.createElement("DIV");
      recetaCard.classList.add("card", "mb-4");

      // Creamos la imagen correspondiente que va a llevar cada card de receta
      // Y añadimos clases y atributos
      const recetaImagen = document.createElement("IMG");
      recetaImagen.classList.add("card-img-top");
      // Usamos la variable extraida de strMeal, si no la encuentra, la busca como receta.title  del objeto de la receta
      recetaImagen.alt = `Recipe Image: ${strMeal ?? receta.title}`; 
      // Usamos la variable extraida de strMealThumb, si no la encuentra, la busca como receta.img  del objeto de la receta
      recetaImagen.src = strMealThumb ?? receta.img;

      // Creamos el body del card y le añadimos la clase
      const recetaCardBody = document.createElement("DIV");
      recetaCardBody.classList.add("card-body");

      // Creamos el heading  que va a llevar cada card
      const recetaHeading = document.createElement("H3");
      recetaHeading.classList.add("card-title", "mb-3");
      recetaHeading.textContent = strMeal ?? receta.title;

      // Creamos el boton que va a llevar cada card
      const recetaButton = document.createElement("BUTTON");
      recetaButton.classList.add("btn", "btn-danger", "w-100");
      recetaButton.textContent = "See Recipe";
      // recetaButton.dataset.bsTarget = '#modal'
      // recetaButton.dataset.bsToogle = 'modal'

      // Añadimos el evento de seleccionar la receta al hacer click
      // Usamos la variable extraida de idMeal, si no la encuentra, la busca como receta.id del objeto de la receta
      recetaButton.onclick = () => seleccionarReceta(idMeal ?? receta.id);

      //Inyectar código en el HTML
      // 1º - Añadimos el heading y el button al card body
      // 2º - Añadimos la imagen y el card boy al card
      // 2º - Añadimos el card completo al contenedor que incluye los resultados con cada card
      // 4ª - Añadimos el contenedor con todos los cards al div con id 'resultado'
      recetaCardBody.appendChild(recetaHeading);
      recetaCardBody.appendChild(recetaButton);

      recetaCard.appendChild(recetaImagen);
      recetaCard.appendChild(recetaCardBody);

      recetaContenedor.appendChild(recetaCard);

      resultado.appendChild(recetaContenedor);
    });
  }

  // ******************************************************************

  // Funcion que trae la receta elegida
  function seleccionarReceta(id) {
    const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

    fetch(url)
      .then((response) => response.json())
      .then((resolve) => mostrarRecetaModal(resolve.meals[0]));
  }

  // ******************************************************************

  // Funcion que muestra el modal de cada receta
  function mostrarRecetaModal(receta) {
    // Extraemos de la respuesta del fetch
    const { idMeal, strMeal, strInstructions, strMealThumb } = receta;

    // Selectores del modal
    const modalTitle = document.querySelector("#modal .modal-title");
    const modalBody = document.querySelector("#modal .modal-body");

    // Añadimos contenido a cada elemento del modal
    modalTitle.textContent = strMeal;

    // Inyectamos el html al body del modal
    modalBody.innerHTML = `
      <img class='img-fluid' src='${strMealThumb}' alt='${strMeal}'/>
      <h3 class='my-3 text-center'>Instructions:</h3>
      <p>${strInstructions}</p>
      <h3 class='my-3 text-center'>Ingredients:</h3>
    `;

    // Creamos UL donde van a ir los ingredientes
    const listGroup = document.createElement("UL");
    // Añadimos la clase de Bootstrap para los UL
    listGroup.classList.add("list-group");

    // Mostrar ingredientes y cantidades

    // Creamos un bucle for de max 20 elementos (los ingredientes que retorna la API)
    for (let i = 1; i < 20; i++) {
      // Si la receta que recibimos de la API en la posicion i tiene algo
      if (receta[`strIngredient${i}`]) {
        // Creamos las variables
        const ingrediente = receta[`strIngredient${i}`];
        const cantidad = receta[`strMeasure${i}`];

        // Creamos el LI del ingrediente y la cantidad
        const ingredienteLi = document.createElement("LI");
        ingredienteLi.classList.add("list-group-item");
        ingredienteLi.textContent = `${ingrediente} - ${cantidad}`;

        // Lo inyectamos al UL
        listGroup.appendChild(ingredienteLi);
      }
    }

    // Inyectamos la lista completa con ingredientes al modalBody
    modalBody.appendChild(listGroup);

    // Botones de Cerrar y Favoritos

    // Seleccionamos el modal
    const modalFooter = document.querySelector(".modal-footer");

    // limpiamos HTML
    limpiarHTML(modalFooter);

    // Boton para agregar a favoritos
    const btnFavorito = document.createElement("button");
    btnFavorito.classList.add("btn", "btn-success", "col");
    // Si ya existe, mostrar "Remove" en el boton. Si no existe, mostramos "Add"
    btnFavorito.textContent = existeStorage(idMeal)
      ? "Remove Favorite"
      : "Add to Favorites";

    // LocalStorage
    btnFavorito.onclick = () => {
      // Comprobamos si ya existe una receta con ese id en Local Storage
      // Si ya existe, el return impide que siga ejecutando el codigo y lo vuelva a añadir
      if (existeStorage(idMeal)) {
        // Usamos la funcion de eliminar, pasandole el id para que lo filtre
        eliminarFavorito(idMeal);
        // Cambiamos el texto del boton para poder añadirlo de nuevo
        btnFavorito.textContent = "Add to Favorites";
        mostrarToast("Removed");
        return;
      }

      // Si no existe aun en LocalStorage, añade la receta con este formato de objeto
      agregarFavorito({
        id: idMeal,
        title: strMeal,
        img: strMealThumb,
      });
      // Cambiamos el texto del boton para poder eliminarlo
      btnFavorito.textContent = "Remove Favorite";
      mostrarToast("Added");
    };

    // Boton de Cerrar
    const btnCerrar = document.createElement("button");
    btnCerrar.classList.add("btn", "btn-danger", "col");
    // Añadimos el dataset propio de Bootstrap para añadir la funcionalidad de cierre
    btnCerrar.dataset.bsDismiss = "modal";
    btnCerrar.textContent = "Close";

    // Añadimos los botones al modal
    modalFooter.appendChild(btnFavorito);
    modalFooter.appendChild(btnCerrar);

    // Muestra el modal con los elementos ya inyectados
    modal.show();
  }

  // ******************************************************************

  //Funcion para agregar a favoritos
  function agregarFavorito(receta) {
    // Seleccionamos el array de favoritos o, si no existia aun, lo creamos
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];

    // Colocamos el nuevo favorito en LS (obtenemos una copia del array de favoritos y lueglo lo añadimos)
    localStorage.setItem("favoritos", JSON.stringify([...favoritos, receta]));
  }

  // ******************************************************************

  //Funcion para eliminar de favoritos
  function eliminarFavorito(id) {
    // Seleccionamos el array de favoritos o, si no existia aun, lo creamos
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];

    // Treamos todos los diferentes al id seleccionado
    const nuevosFavoritos = favoritos.filter((favorito) => favorito.id !== id);

    // Colocamos los favoritos ya filtrados en LS, sin el ID que hemos removido
    localStorage.setItem("favoritos", JSON.stringify(nuevosFavoritos));
  }

  // ******************************************************************

  function existeStorage(id) {
    // Seleccionamos el array de favoritos o, si no existia aun, lo creamos
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];

    // Comprobamos si ya existe o no en los favoritos añadidos a LS (devuelve true o false)
    return favoritos.some((favorito) => favorito.id === id);
  }

  // ******************************************************************

  function mostrarToast(mensaje) {
    const toastDiv = document.querySelector("#toast");
    const toastBody = document.querySelector(".toast-body");

    const toast = new bootstrap.Toast(toastDiv);
    toastBody.textContent = mensaje;
    toast.show();
  }

  // ******************************************************************

  function obtenerFavoritos() {
    // Seleccionamos el array de favoritos o, si no existia aun, lo creamos
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) ?? [];

    // Si favoritos tiene algo
    if(favoritos.length){
      //Usamos la funcion que muestra las recetas, pasandole las recetas que hay almacenadas en favoritos
      mostrarRecetas(favoritos)
      return
    } 

    // Si no hay favoritos, creamos un párrafo, lo inyectamos al div de resultado y lo mostramos
    const noHayFavoritos = document.createElement('P')
      noHayFavoritos.textContent = 'Not Favorites yet!'
      noHayFavoritos.classList.add('fs-4', 'text-center', 'mt-5')
      resultado.appendChild(noHayFavoritos)
  }


  // ******************************************************************
  // Funcion para limpiar el html previo en el div de resultado

  // Le pasamos un selector para que la funcion sea util en otras partes de la app
  function limpiarHTML(selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  }
}
