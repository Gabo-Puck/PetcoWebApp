
const element = document.getElementById("like") ;
element.addEventListener("click", myFunction);


function myFunction() {
alert(idSession);
console.log('oj');
fetch(`/petco/publicacion/likes/${idSession}/${idPublicacion}`)
.then((res)=>res.json)
.then((res) =>{
    console.log(res)
})

}