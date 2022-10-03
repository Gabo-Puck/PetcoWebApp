
const element = document.getElementById("like") ;
element.addEventListener("click", myFunction);

const Like = require("../../models/Like");

Like.query()
.where('like.ID_Usuario' , '=', idSession)
.then((r) =>{
    console.log(r);
})

fetch()

function myFunction() {
alert(idSession);
}