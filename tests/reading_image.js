const fs = require('fs');
var path = "'C:/Users/usuario-x/Pictures/Saved Pictures/imagen-x.jpg'";
// let imagen = fs.readFileSync(path);
// if (imagen) {
//     // console.log(imagen); <Buffer .. .. ...> //contenido en bits? de la imagen en txt
//     fs.writeFileSync('./tests/imagen.jpg', imagen);
// }

let existe = fs.existsSync(path.slice(1,-1));
console.log('el archivo existe:', existe);