const element = document.getElementById("like");
element.addEventListener("click", heart);
//Iconos
const tolike = document.querySelector(".IconToLike");
const liked = document.querySelector(".IconLiked");
//Bandera para el boton
var ban = true;
//Contador
document.getElementById("clicks").innerHTML = clicks;

//Identificar si se ha dado like con anterioridad
fetch(
  `/petco/publicacion/likes/${idPublicacion}/${idSession}/0/${idUsuarioPublicacion}`
)
  .then((res) => res.json())
  .then((res) => {
    if (res.length > 0) {
      console.log("🚀 ~ file: LikeScript.js ~ line 16 ~ .then ~ res", res);
      ban = false;
      tolike.style.display = "none";
      liked.style.display = "block";
    } else {
      console.log("🚀 ~ file: LikeScript.js ~ line 16 ~ .then ~ res", res);

      tolike.style.display = "block";
      liked.style.display = "none";
      ban = true;
    }
  });

function heart() {
  //alert(idSession);
  if (ban == true) {
    //Cuando se indica que me gusta
    tolike.style.display = "none";
    liked.style.display = "block";
    ban = false;
    //Se realiza la query (Se crea el registro del like)
    fetch(
      `/petco/publicacion/likes/${idPublicacion}/${idSession}/1/${idUsuarioPublicacion}`
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      });
    //Se agrega 1 al numero
    clicks += 1;
    document.getElementById("clicks").innerHTML = clicks;
    console.log(clicks);
  } else {
    //Cuando se indica que no me gusta
    tolike.style.display = "block";
    liked.style.display = "none";
    ban = true;

    //Se realiza la query (Se elimina el registro del like)
    fetch(
      `/petco/publicacion/likes/${idPublicacion}/${idSession}/2/${idUsuarioPublicacion}`
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      });

    //Se resta 1 al numero
    clicks -= 1;
    document.getElementById("clicks").innerHTML = clicks;
  }

  console.log("oj");
}
