// array donde se almacenan los objetos de productos
let productos = [];

//elementos del DOM

const formulario = document.getElementById("formulario-producto");
const campoNombre = document.getElementById("campo-nombre");
const campoPrecio = document.getElementById("campo-precio");
const campoCantidad = document.getElementById("campo-cantidad");
const mensajeError = document.getElementById("mensaje-error");

const cuerpoTabla = document.getElementById("cuerpo-tabla");
const campoBusqueda = document.getElementById("campo-busqueda");

const totalDiferentes = document.getElementById("total-diferentes");
const totalUnidades = document.getElementById("total-unidades");
const totalValor = document.getElementById("total-valor");


//funciones auxiliares - para formeto y error

function formeatearMoneda(monto){
    return 'Q' + monto.toFixed(2);
}

function mostrarError(mensaje){
    if (mensaje){
        mensajeError.textContent = mensaje;
        mensajeError.style.display = "block";
    } else {
        mensajeError.textContent = "";
        mensajeError.style.display = "none";
    }
}
//validaciones iniciales
function validarDatos(nombre, precio, cantidad){

if (nombre.trim() === ""){
    mostrarError("El nombre del producto no puede estar vacío.");
    return false;
}

if (isNaN(precio) || precio <= 0){
    mostrarError("El precio debe ser un número mayor que cero.");
    return false;
}

if (isNaN(cantidad) || !Number.isInteger(cantidad) || cantidad <= 0){
    mostrarError("La cantidad debe ser un número entero mayor que cero.");
    return false;
}
mostrarError(""); //limpiar mensaje de error si todo está bien
return true;
}

//insertar producto en la tabla
function crearTabla(){
    const terminoBusqueda = campoBusqueda.value.trim().toLowerCase();

    const listaParaMostrar = productos.filter(function(prod){
        return prod.nombre.toLowerCase().includes(terminoBusqueda);
    });

    cuerpoTabla.innerHTML = "";

    if (listaParaMostrar.length === 0){
        cuerpoTabla.innerHTML = "<tr><td colspan='5' class='texto-centrado'>No se encontraron productos.</td></tr>";
        return;
    }

    listaParaMostrar.forEach(function(prod){
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${prod.nombre}</td>
            <td>${formeatearMoneda(prod.precio)}</td>
            <td>${prod.cantidad}</td>
            <td>${formeatearMoneda(prod.precio * prod.cantidad)}</td>
            <td><button class="btn btn-danger" onclick="eliminarProducto(${prod.id})">Eliminar</button></td>
        `;
        cuerpoTabla.appendChild(fila);
    });

}

//funcion - registrar producto
formulario.addEventListener("submit", function(evento){
    evento.preventDefault();

    const nombre = campoNombre.value;
    const precio = parseFloat(campoPrecio.value);
    const cantidad = Number(campoCantidad.value);

//ejecutar validaciones
if (!validarDatos(nombre, precio, cantidad)){
    return;
}

const nuevoProducto = {
    id: Date.now(), //identificador en milisegundos ya que no se repite (para no usar IDs secuenciales)
    nombre: nombre.trim(),
    precio: precio,
    cantidad: cantidad
};


//se agregan los productos al array
productos.push(nuevoProducto);



//limpiar formulario
formulario.reset();
campoNombre.focus();



//actualizar la tabla
crearTabla();

});  
