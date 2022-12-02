/* -------Servidor------- */
const moment = require("moment");
const express = require("express");
const app = express();

const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const Contenedor = require("./src/contenedor/contenedorFs");

const messages = [
  {
    email: "juan@email.com",
    text: "Hola! que tal?",
    time: moment(new Date()).format("DD/MM/YYYY hh:mm:ss"),
  },
  {
    email: "pedro@email.com",
    text: "Muy bien! y vos?",
    time: moment(new Date()).format("DD/MM/YYYY hh:mm:ss"),
  },
  {
    email: "ana@email.com",
    text: "Genial!",
    time: moment(new Date()).format("DD/MM/YYYY hh:mm:ss"),
  },
];

const PUERTO = 8080;
const publicRoot = "./public";

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

/* --------------------- */

//Lineas para usar json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Hacemos la carpeta Public visible
app.use(express.static(publicRoot));

/* --------------------- */

const productos = new Contenedor("./src/db/productos.txt");
const mensajes = new Contenedor("./src/db/mensajes.txt");

/*------- EndPoints ------- */

app.get("/", (peticion, respuesta) => {
  respuesta.send("index.html", { root: publicRoot });
});

/*-------Servidor------- */
const servidor = httpServer.listen(PUERTO, () => {
  console.log(`Servidor escuchando: ${servidor.address().port}`);
});

servidor.on("error", (error) => console.log(`Error: ${error}`));
/*--------------------- */

/*-------Socket------- */

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");

  const listaProductos = await productos.getAll();
  socket.emit("nueva-conexion", listaProductos);

  socket.on("new-product", async (data) => {
    await productos.save(data);
    io.sockets.emit("producto", data);
  });

  //Para enviar todos los mensajes a la primera conexion
  const listaMensajes = await mensajes.getAll();
  socket.emit("messages", listaMensajes);

  //Evento para recibir los nuevos mensajes
  socket.on("new-message", async (data) => {
    data.time = moment(new Date()).format("DD/MM/YYYY hh:mm:ss");
    await mensajes.save(data);
    const listaMensajes = await mensajes.getAll();

    io.sockets.emit("messages", listaMensajes);
  });
});
