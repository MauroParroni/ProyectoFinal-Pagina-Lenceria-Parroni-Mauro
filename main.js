//PARTE PARA LOGUEARSE
class admin {
  constructor(usua, contraseña) {
    this.usua = usua;
    this.contraseña = contraseña;
  }
}
async function verificarUsuario() {
  const verificaUsuario = document.querySelector("#card"); // Agarro el elemento con el ID "card" del formulario
  if (verificaUsuario) {
    verificaUsuario.addEventListener("submit", async (e) => {
      e.preventDefault(); // Evito que se recargue la página al enviar el formulario
      const user = e.target.querySelector("#usuario").value; // Obtengo el valor del campo de usuario
      const pass = e.target.querySelector("#contra").value; // Obtengo el valor del campo de contraseña

      try {
        const response = await fetch("../admin.json"); // Realizo la solicitud para obtener el archivo JSON
        if (!response.ok) {
          throw new Error("Error al cargar el archivo JSON"); // Lanzo un error si hay un problema al cargar el archivo JSON
        }
        const data = await response.json(); // Convierto la respuesta en formato JSON

        // Verifico si el usuario y la contraseña coinciden con los valores del archivo JSON
        if (data.usuario === user && data.contraseña === pass) {
          // Verificación exitosa
          Swal.fire({
            title: "Procesando...",
            showConfirmButton: false,
            allowOutsideClick: false,
            willOpen: () => {
              Swal.showLoading();
            },
          });
          setTimeout(() => {
            Swal.fire({
              title: "Inicio de sesión exitoso",
              icon: "success",
              confirmButtonText: "Aceptar",
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = "../index.html";
                localStorage.setItem("isLoggedIn", "true");
              }
            });
          }, 3000);
        } else {
          // Contraseña incorrecta
          Toastify({
            text: "Contraseña incorrecta",
            gravity: "bottom",
            position: "right",
            duration: 3000,
            style: {
              background: "red",
            },
          }).showToast();
        }
      } catch (error) {
        console.log("Error:", error);
      }
    });
  }
}

// Llamo a la función verificarUsuario para activar la verificación del usuario
verificarUsuario();
if (localStorage.getItem("isLoggedIn") === "true") {
  // y aca hago desaparecer el boton de login y hago aparecer el panel de admin
  let url = "../Paginas/panel_admin.html";
  if (document.querySelector("#index")) {
    url = "./Paginas/panel_admin.html";
  }
  let boton = document.getElementById("booot");
  if (boton) {
    boton.style.display = "none";
    let header = document.getElementById("header");
    header.innerHTML =
      '<h1 class="col-md-11">Roma Lenceria</h1>' +
      '<button type="button" class="btn btn-danger col-md-1" id="adm">' +
      `<a href=${url} class="link-light logxd">` +
      "Panel Admin" +
      "</a>" +
      "</button>";
  }
}
// PARTE PARA SUBIR LOS PRODUCTOS
class Producto {
  constructor(nombre, precio, stock, tipo, imagen, id) {
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
    this.tipo = tipo;
    this.imagen = imagen;
    this.id = id;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////// PRODUCTOS/////////////////////////////////////////////////////////////////////
let carrito = JSON.parse(localStorage.getItem("carrito")) ?? [];
const productos = JSON.parse(localStorage.getItem("productos")) || []; //verifico si ya hay algo guardado en el localstorage
if (productos.length < 4) {
  const producto1 = new Producto("Boxers de algodón", 15, 10, "boxers", "https://http2.mlstatic.com/D_NQ_NP_618103-MLA47359574963_092021-O.webp", 1);
  const producto2 = new Producto("Conjunto de algodón", 25, 15, "conjuntos", "https://http2.mlstatic.com/D_NQ_NP_847003-MLA43430146528_092020-O.webp", 2);
  const producto3 = new Producto("Medias estampadas", 12, 20, "medias", "https://www.modapoint.com.ar/38198-large_default/medias-soquete-ninos-juvenil-surtido-liso-pack-x3-talle-4-elemento.jpg", 3);
  const producto4 = new Producto("Pantuflas", 18, 5, "otros", "https://http2.mlstatic.com/D_NQ_NP_926681-MLA50981632504_082022-O.webp", 4);

  productos.push(producto1);
  productos.push(producto2);
  productos.push(producto3);
  productos.push(producto4);
  localStorage.setItem("productos", JSON.stringify(productos));
}
const cargarProducto = document.querySelector(".panel2");
cargarProducto?.addEventListener("submit", (e) => {
  //utilizo el ? para verificar si existe cargar producto en el HTML
  e.preventDefault();
  console.log("Formulario enviado");
  const nombre = document.querySelector("#nombreProducto").value;
  const precio = document.querySelector("#precioProducto").value;
  const errorPrecio = document.querySelector("#errorPrecio");
  if (isNaN(precio)) {
    errorPrecio.textContent = "El precio ingresado no es válido";
    errorPrecio.style.display = "block";
    return;
  } else {
    errorPrecio.style.display = "none";
  }
  const stock = document.querySelector("#stock").value;
  const errorStock = document.querySelector("#errorStock");
  if (isNaN(stock)) {
    // su respectiva validacion
    errorStock.textContent = "Ingrese un valor valido";
    errorStock.style.display = "block";
    return;
  } else {
    errorStock.style.display = "none";
  }
  const tipoSelect = document.querySelector("#tipoProducto");
  const tipo = tipoSelect.value;
  const imagenProducto = document.querySelector("#imagenProducto").files[0]; // uso la propiedad file con indice 0 para conseguir el primer archivo de la lista
  const reader = new FileReader(); //aca se lee el contenido del archivo y lo transforma en una URL para poder mostrar el producto
  reader.addEventListener("load", () => {
    const imagenURL = reader.result; // una vez transformada en url lo guardo en la variable imagenurl para crear un nuevo producto
    const cantidadProductos = productos.length;
    const id = cantidadProductos + 1;
    const nuevoProducto = new Producto(
      nombre,
      precio,
      stock,
      tipo,
      imagenURL,
      id
    );
    productos.push(nuevoProducto);
    localStorage.setItem("productos", JSON.stringify(productos)); //guardo los productos en el localstorage en forma de json porque es un objeto
    console.log(nuevoProducto);
    console.log(productos);
    const happy = document.querySelector(".happy"); //algo random
    happy.innerHTML += `<h3>Felicidades subiste un producto</h3>
          <img src="../Imagenes/happy.gif" alt="" ></img>
          `;
  });
  if (imagenProducto) {
    reader.readAsDataURL(imagenProducto);
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////// CARRITO/////////////////////////////////////////////////////////////////////
const agregarCarrito = (id) => {
  //agregar elementos al carrito
  const formulario = document.getElementById(`formulario${id}`);
  formulario?.addEventListener("submit", (e) => {
    e.preventDefault();
    const cantidad = parseInt(e.target.elements.cantidad.value);
    const productoExistente = carrito.find(
      (itemCarrito) => itemCarrito.id === id
    );
    console.log(productoExistente); //busco si el producto ya existe en el carrito
    if (productoExistente) {
      productoExistente.cantidad += cantidad;
      const producto = productos.find((producto) => producto.id === id);
      if (productoExistente.cantidad > producto.stock) {
        // La cantidad excede el stock disponible
        const errorCantidad = e.target.querySelector("#errorCantidad");
        errorCantidad.textContent = "Ingrese un valor válido";
        errorCantidad.style.display = "block";
        productoExistente.cantidad = 0;
      }
      Toastify({
        text: "Producto añadido al carrito",
        gravity: "bottom",
        position: "right",
        duration: 3000,
        style: {
          background: "green",
        },
      }).showToast();
    } else {
      // El producto no existe en el carrito, lo agrego como un nuevo objeto
      Toastify({
        text: "Producto añadido al carrito",
        gravity: "bottom",
        position: "right",
        duration: 3000,
        style: {
          background: "green",
        },
      }).showToast();
      carrito.push({
        id,
        cantidad,
      });
    }
    console.log(carrito);
    localStorage.setItem("carrito", JSON.stringify(carrito));
  });
};

// Función para mostrar los productos filtrados según los checkboxes seleccionados
const mostrarProductos = () => {
  const tablaProductos = document.querySelector(".productos");

  if (tablaProductos) {
    // Filtrar los productos según los checkboxes seleccionados
    const productosFiltrados = productos.filter((producto) => {
      if (checkboxBoxers.checked && producto.tipo === "boxers") {
        return true;
      }
      if (checkboxConjuntos.checked && producto.tipo === "conjuntos") {
        return true;
      }
      if (checkboxMedias.checked && producto.tipo === "medias") {
        return true;
      }
      if (checkboxOtros.checked && producto.tipo === "otros") {
        return true;
      }
      return false;
    });

    tablaProductos.innerHTML = "";

    // Generar el HTML para mostrar los productos filtrados
    productosFiltrados.forEach((nuevoProducto) => {
      tablaProductos.innerHTML += `
        <div class="col-md-3 Centrado">
          <div class="Articulos">
            <div class="carta">
              <figure>
                <img src="${nuevoProducto.imagen}" alt="Imagen de producto">
              </figure>
              <div class="contenido">
                <h3>${nuevoProducto.nombre}</h3>
                <h6>Disponibles: ${nuevoProducto.stock}</h6>
                <p>${nuevoProducto.precio}$</p>
                <form id="formulario${nuevoProducto.id}">
                  <input name="cantidad" type="number" value="1" min="1" max="${nuevoProducto.stock}" class="cant">
                  <button type="submit" class="btn btn-outline-dark">Añadir al carro</button>
                  <span id="errorCantidad" style="color: red; display: none;"></span>
                </form>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    productosFiltrados.forEach((nuevoProducto) => {
      agregarCarrito(nuevoProducto.id);
      console.log(nuevoProducto.id)
    })
  }
};

// Obtener los checkboxes
const checkboxBoxers = document.querySelector("#boxers");
const checkboxConjuntos = document.querySelector("#conjuntos");
const checkboxMedias = document.querySelector("#medias");
const checkboxOtros = document.querySelector("#otros");

// Agregar event listeners a los checkboxes para actualizar la visualización de los productos
checkboxBoxers?.addEventListener("change", mostrarProductos);
checkboxConjuntos?.addEventListener("change", mostrarProductos);
checkboxMedias?.addEventListener("change", mostrarProductos);
checkboxOtros?.addEventListener("change", mostrarProductos);

// Llamar a mostrarProductos inicialmente para mostrar todos los productos
mostrarProductos();

//////////////////////////////////////////////////////////////////////////////////////////////// CARRITO/////////////////////////////////////////////////////////////////////
let acum = 0;
carrito.forEach((itemCarrito) => {
  // mostrar elementos en el carrito
  const idCarrito = itemCarrito.id;
  const producto = productos.find((producto) => producto.id === idCarrito);
  if (producto) {
    // busco si lo que esta en el carrito estan en los productos disponibles
    const precioProducto = parseFloat(producto.precio);
    const cantidadCarrito = parseInt(itemCarrito.cantidad);
    acum += precioProducto * cantidadCarrito;
    const tablaCarrito = document.querySelector("#carrote");
    if (tablaCarrito) {
      if (cantidadCarrito === 0) {
        tablaCarrito.innerHTML = "";
      } else {
        // creo una instancia en la tabla del carrito
        const tr = document.createElement("tr");
        tr.dataset.id = idCarrito;
        tr.innerHTML = `
              <th scope="row">1</th>
              <td>
                <img src="${producto.imagen}" alt="Imagen del producto" class="img-fluid img-thumbnail">
              </td>
              <td>
                <p class="fs-6">${producto.nombre}</p>
              </td>
              <td>${producto.precio}$</td>
              <td>${itemCarrito.cantidad}</td>
              <td>
                <button type="button" id="btn-close-${idCarrito}" class="btn-close" aria-label="Close"></button>
              </td>
            `;
        tablaCarrito.appendChild(tr);

        const totalProducto = document.querySelector("#total");
        totalProducto.innerHTML = `
          $${acum}
          `;
        const eliminarProductoCarrito = (id) => {
          // Buscar el índice del producto en el carrito
          const index = carrito.findIndex(
            (itemCarrito) => itemCarrito.id === id
          );
          if (index !== -1) {
            // Eliminar el producto del carrito
            carrito.splice(index, 1);
          }
        };
        const botonEliminar = document.querySelector(`#btn-close-${idCarrito}`);
        botonEliminar.addEventListener("click", (e) => {
          // esto sirve por si deseas eliminar un producto del carrito
          const boton = e.target;
          const parentTr = boton.closest("tr");
          const idCarrito = parseInt(parentTr.dataset.id);
          console.log(idCarrito);
          Swal.fire({
            title: "¿Deseas eliminar el producto del carrito?",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
          }).then((result) => {
            if (result.isConfirmed) {
              eliminarProductoCarrito(idCarrito);
              Swal.fire("producto eliminado");
              localStorage.setItem("carrito", JSON.stringify(carrito));
              parentTr.remove();
            } //
          });
        });
      }
    }
  }
});
const botonComprar = document.querySelector("#botonComprar");
botonComprar?.addEventListener("click", (e) => {
  // Obtener la tabla del carrito y verificar si tiene contenido
  const tablaCarrito = document.querySelector("#carrote");
  const contenidoTabla = tablaCarrito.querySelector("tr");

  if (contenidoTabla) {
    // Mostrar mensaje de confirmación para realizar la compra
    Swal.fire({
      title: "¿Deseas realizar la compra?",
      showCancelButton: true,
      confirmButtonText: "Si",
    }).then((result) => {
      if (result.isConfirmed) {
        // Mostrar un mensaje de carga mientras se elimina el carrito
        Swal.fire({
          title: "Procesando...",
          showConfirmButton: false,
          allowOutsideClick: false,
          willOpen: () => {
            Swal.showLoading();
          },
        });
        // Retrasar la eliminación del carrito por 3 segundos para en este caso simular una verificacion
        setTimeout(() => {
          carrito.forEach((itemCarrito) => {
            idcarrito = itemCarrito.id;
            producto = productos.find((producto) => producto.id === idcarrito);
            if (producto) {
              producto.stock -= itemCarrito.cantidad;
              if (producto.stock === 0) {
                // Buscar el índice del producto en el arreglo productos
                const index = productos.findIndex((p) => p.id === producto.id);
                if (index !== -1) {
                  // Si se encuentra el producto, eliminarlo utilizando splice
                  productos.splice(index, 1);
                }
              }
            }
          });
          // Vaciar el carrito
          carrito = [];
          // Actualizar el almacenamiento local del carrito y del producto
          localStorage.setItem("carrito", JSON.stringify(carrito));
          localStorage.setItem("productos", JSON.stringify(productos));
          // Eliminar las filas de la tabla
          tablaCarrito.innerHTML = "";
          // Mostrar mensaje de éxito
          Swal.fire("Compra realizada con éxito");
        }, 3000); // Retraso de 3 segundos
      }
    });
  } else {
    // Mostrar mensaje de error si no hay productos en el carrito
    Toastify({
      text: "Por favor ingrese productos al carrito",
      gravity: "bottom",
      position: "right",
      duration: 3000,
      style: {
        background: "red",
      },
    }).showToast();
  }
});
mostrarProductos();
