const fs = require("fs");

class Contenedor {
  constructor(nombre) {
    this.nombre = nombre;
  }

  async save(objeto) {
    const archivo = await fs.promises.readFile(this.nombre, "utf-8");
    const archivoParseado = JSON.parse(archivo);
    let id = 1;
    archivoParseado.forEach((element, index) => {
      if (element.id >= id) {
        id = element.id + 1;
      }
    });
    objeto.id = id;
    console.log(objeto.id);
    archivoParseado.push(objeto);
    await fs.promises.writeFile(
      this.nombre,
      JSON.stringify(archivoParseado, null, 2)
    );
    return id;
  }

  async getById() {
    const archivo = await fs.promises.readFile(this.nombre, "utf-8");
    const archivoParseado = JSON.parse(archivo);
    console.log(await archivoParseado);
    let objetoSeleccionado = null;
    archivoParseado.forEach((element) => {
      if (element.id == id) {
        objetoSeleccionado = element;
        console.log(objetoSeleccionado);
      }
    });
    return objetoSeleccionado;
  }

  async getAll() {
    const archivo = await fs.promises.readFile(this.nombre, "utf-8");
    const archivoParseado = JSON.parse(archivo);
    return archivoParseado;
  }

  async deleteById(id) {
    const archivo = await fs.promises.readFile(this.nombre, "utf-8");
    const archivoParseado = JSON.parse(archivo);
    let indexSeleccionado = 0;
    archivoParseado.forEach((element, index) => {
      if (element.id == id) {
        indexSeleccionado = index;
      }
    });
    if (indexSeleccionado != -1) {
      archivoParseado.spice(indexSeleccionado, 1);
      await fs.promises.writeFile(
        this.nombre,
        JSON.stringify(archivoParseado, null, 2)
      );
    }
  }

  async deleteAll() {
    const arregloVacio = [];
    await fs.promises.writeFile(
      this.nombre,
      JSON.stringify(arregloVacio, null, 2)
    );
  }
}

module.exports = Contenedor;
