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

const elTotalDiferentes = document.getElementById("total-diferentes");
const elTotalUnidades = document.getElementById("total-unidades");
const elTotalValor = document.getElementById("total-valor");


//funciones auxiliares - para formato y error----------------------------
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

//validaciones iniciales---------------------------------------------
function validarDatos(nombre, precio, cantidad){

if (nombre.trim() === ""){
    mostrarError("El nombre del producto no puede estar vacío.");
    return false;
}

if (isNaN(precio) || precio <= 0){
    mostrarError("El precio debe ser un número mayor que cero.");
    return false;
}

if (isNaN(cantidad) || !Number.isInteger(cantidad) || cantidad < 0){
    mostrarError("La cantidad debe ser un número entero no negativo.");
    return false;
}
mostrarError(""); //limpiar mensaje de error si todo está bien
return true;
}

//calcular totales-----------------------------------------------
function calcularTotales(){
    const productosDiferentes = productos.length; //total productos diferentes

    const totalUnidades = productos.reduce(function(acumulador, prod){ //total inventario
        return acumulador + prod.cantidad;
    }, 0);

    const totalValor = productos.reduce(function(acumulador, prod){ //valor total inventario
        return acumulador + (prod.precio * prod.cantidad);
    }, 0);

    //actualizar los valores en el HTML
    elTotalDiferentes.textContent = productosDiferentes;
    elTotalUnidades.textContent = totalUnidades;
    elTotalValor.textContent = formeatearMoneda(totalValor);
}

//insertar productos en la tabla y busqueda de productos---------------------------------
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

    //generar cdada fila por separado y agregarla al cuerpo de la tabla
    listaParaMostrar.forEach(function(prod){
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${prod.nombre}</td>
            <td>${formeatearMoneda(prod.precio)}</td>
            <td>${prod.cantidad}</td>
            <td>${formeatearMoneda(prod.precio * prod.cantidad)}</td>
            <td><button class="boton-eliminar" onclick="eliminarProducto(${prod.id})">Eliminar</button></td>
        `;
        cuerpoTabla.appendChild(fila);
    });

}

//funcion - registrar producto sin recargar la pagina------------------------------------
formulario.addEventListener("submit", function(evento){
    evento.preventDefault();

    const nombre = campoNombre.value;
    const precio = parseFloat(campoPrecio.value);
    const cantidad = Number(campoCantidad.value);

//ejecutar validaciones
if (!validarDatos(nombre, precio, cantidad)){
    return;
}

//se crea el objeto producto con los datos del formulario
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
//actualizar los totales
calcularTotales();

});  

//funcion eliminar producto-----------------------------------------------
window.eliminarProducto = function(id){
    productos = productos.filter(function(prod){
        return prod.id !== id;
    });

    //actualizar la tabla
    crearTabla();
    //actualizar los totales
    calcularTotales();
};

//funcion busqueda de productos-----------------------------------------------
campoBusqueda.addEventListener("input", function(){
    crearTabla();
});

crearTabla(); //inicializar la tabla vacía
calcularTotales(); //inicializar los totales en cero
