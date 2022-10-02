var socket = io(); //Se inicializa dentro del scritp socket.io
//Se obtienen algunos de los datos que conforman el comentario



window.onload = function () { //Se ejecuta al terminar de cargar la pagina
    socket.emit('publicacion', idPublicacion); //Metodo que etablece la sala y el contexto de los comentarios dentro de la publicacion
}

var tarjeta = document.querySelector(".comentarioTemplate"); //Se obtiene el formato del comentario de un template
const form = document.querySelector('form')
const input = document.querySelector('input') //Se obtiene el texto contenido dentro del input del comentario
form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (input.value) { //Se ejecuta lo siguiente al haber introducido el texto
        //Se envian los datos a la funcion 
        var today = new Date();
        var date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + " " + time;
        socket.emit('comentario', { msg: input.value, id: idPublicacion, nombre: nombreuser, imagen: imagenperfil, fecha: dateTime })
        input.value = ''
    }

})

socket.on('comentario', ({ msg, nombre, imagen, fecha, idcomentario }) => {

    var tarjeta2 = tarjeta.cloneNode(true); //se clona un elemento con las caracteristicas de un comentario
    var list = document.querySelector(".comentarios"); //Se obtienen todos los comentarios existentes para poder acomdarlos


    tarjeta2.style.display = 'block'// se hace visible el comentario
    tarjeta2.querySelector("form").id = ("comentario-"+ idcomentario);
    tarjeta2.querySelector(".contenido").innerText = msg; //Se le introduce dentro del div contenido el texto del comentario
    tarjeta2.querySelector(".nombreusuario").innerText = nombre; //Se le introduce dentro del div del nombreusuario el nombre del usuario
    tarjeta2.querySelector(".imagenusuario").src = imagen; //se coloca dentro de la imagen, la imagen del usuario
    tarjeta2.querySelector(".fechahecho").innerText = "—" + fecha;
    document.querySelector(".comentarios").insertBefore(tarjeta2, list.children[0]); //Se inserta el comentario dentro 

    tarjeta2.querySelector("form").addEventListener('submit', (e) => {
        e.preventDefault()
        if (tarjeta2.querySelector("input").value) { //Se ejecuta lo siguiente al haber introducido el texto
            //Se envian los datos a la funcion 
            var today = new Date();
            var date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + " " + time;
            

            socket.emit('respuesta', { msg: tarjeta2.querySelector("input").value, idP:idPublicacion, idcomentario:idcomentario, nombre: nombreuser, imagen: imagenperfil, fecha: dateTime  })
            tarjeta2.querySelector("input").value = ''
        }

    })

})





console.log(comentariosJS);
window.onload = function () { //Se ejecuta al terminar de cargar la pagina
    socket.emit('publicacion', idPublicacion); //Metodo que etablece la sala y el contexto de los comentarios dentro de la publicacion
}

//Se definen los formularios e inputs de los comentarios para poder agregarle sus event listener
const GetCommentsForm = new Array();
const GetCommentsInput = new Array();

for (let i = 0; i < ncomentarios; i++) { //Se obtienen los formularios 
    GetCommentsForm[i] = document.querySelector('#comentarioForm-' + comentariosJS[i].ID);
    GetCommentsInput[i] = document.querySelector('#inputC-' + comentariosJS[i].ID);
}


for (let i = 0; i < ncomentarios; i++) { //Se asignan los eventos
    console.log(GetCommentsForm[i]);
    console.log(GetCommentsInput[i]);
    GetCommentsForm[i].addEventListener('submit', (e) => {
        e.preventDefault()
        if (GetCommentsInput[i].value) { //Se ejecuta lo siguiente al haber introducido el texto
            //Se envian los datos a la funcion 
            var today = new Date();
            var date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + " " + time;
            
            socket.emit('respuesta', { msg: GetCommentsInput[i].value, idP:idPublicacion, idcomentario:comentariosJS[i].ID, nombre: nombreuser, imagen: imagenperfil, fecha: dateTime  })
            GetCommentsInput[i].value = ''
        }

    })
}

socket.on('respuesta', ({msg, idP, idcomentario, nombre, imagen, fecha})=>{
    let tarjeta2 = tarjeta.cloneNode(true); //se clona un elemento con las caracteristicas de un comentario
    console.log("me mie");
    tarjeta2.style.display = 'block'// se hace visible el comentario
    tarjeta2.querySelector(".contenido").innerText = msg; //Se le introduce dentro del div contenido el texto del comentario
    tarjeta2.querySelector(".nombreusuario").innerText = nombre; //Se le introduce dentro del div del nombreusuario el nombre del usuario
    tarjeta2.querySelector(".imagenusuario").src = imagen; //se coloca dentro de la imagen, la imagen del usuario
    tarjeta2.querySelector(".fechahecho").innerText = "—" + fecha;
    tarjeta2.querySelector("form").style.display= 'none';
     //Se inserta el comentario dentro 
    document.querySelector("#comentario-"+idcomentario).appendChild(tarjeta2)
   

})