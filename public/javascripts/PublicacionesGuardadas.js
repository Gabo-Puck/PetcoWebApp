const element = document.getElementById("guardar");
element.addEventListener("click", book);
//Iconos
const tosave = document.querySelector('.IconToSave');
const saved = document.querySelector('.IconSaved');
//Bandera para el boton
var banG = true;    
//Identificar si se ha guardado con anterioridad
fetch(`/petco/publicacion/psaved/${idPublicacion}/${idSession}/0`)
    .then((res) => res.json())
    .then((res) => {
        if (res.length >0 ) {
            console.log("🚀 ~ file: Guardar xd ~ line 16 ~ .then ~ res", res)
            banG = false;
            tosave.style.display = 'none';
            saved.style.display = 'block';
            
        }
        else {
            console.log("🚀 ~ file: LikeScript.js ~ line 16 ~ .then ~ res", res)

            tosave.style.display = 'block';
            saved.style.display = 'none';
            banG = true;
        }
    })

function book() {
    if (banG == true) { //Cuando se indica para guardar
        tosave.style.display = 'none';
        saved.style.display = 'block';
        banG = false;
        //Se realiza la query (Se crea el registro del guardado)
        fetch(`/petco/publicacion/psaved/${idPublicacion}/${idSession}/1`)
            .then((res) => res.json())
            .then((res) => {
                console.log(res);

            })
    }
    else { //Cuando se indica que no me gusta
        tosave.style.display = 'block';
        saved.style.display = 'none';
        banG = true;

        //Se realiza la query (Se elimina el registro del like)
        fetch(`/petco/publicacion/psaved/${idPublicacion}/${idSession}/2`)
            .then((res) => res.json())
            .then((res) => {
                console.log(res);

            })
    }

    console.log('oj');

}