function validarLibro(descripcion, autor, anio, editorial) {
    if (descripcion == null || autor == null || anio == null || editorial == null) {
        return false;
    }
    if (descripcion.length > 60) {
        return false;
    }
    if (autor.length > 50) {
        return false;
    }
    if (anio.length !== 4) {
        return false;
    }
    return true;
}

const descripcion = "Ejemplo de descripción";
const autor = "Nombre del autor";
const anio = "2026";
const editorial = "Editorial Ejemplo";
const valido = validarLibro(descripcion, autor, anio, editorial);
console.log("Datos válidos: " + valido);
