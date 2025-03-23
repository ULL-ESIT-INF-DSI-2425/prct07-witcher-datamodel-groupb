// Entidades exportadas por defecto:
export { default as Bien } from "./Entidades/Bien.js";
export { default as Cliente } from "./Entidades/Cliente.js";
export { default as Mercader } from "./Entidades/Mercader.js";
export { default as ElementoAlmacen } from "./Entidades/ElementoAlmacen.js";
export { default as Transaccion } from "./Entidades/Transaccion.js";

// Entidades reexportadas con *:
export * as Entidad from "./Entidades/Entidad.js";

// Gestores exportados por defecto:
export { default as Gestor } from "./Gestores/Gestor.js";
export { default as GestorClientes } from "./Gestores/GestorClientes.js";
export { default as GestorMercaderes } from "./Gestores/GestorMercaderes.js";
export { default as GestorTransacciones } from "./Gestores/GestorTransacciones.js";
export { default as Inventario } from "./Gestores/Inventario.js";

// Reexportar utilidades:
import inquirer from "inquirer";
import Inventario from "./Gestores/Inventario.js";
import GestorClientes from "./Gestores/GestorClientes.js";
import GestorMercaderes from "./Gestores/GestorMercaderes.js";
import Cliente from "./Entidades/Cliente.js";
import Mercader from "./Entidades/Mercader.js";
import ElementoAlmacen from "./Entidades/ElementoAlmacen.js";

enum comandosPrincipales {
  Interactuar_bienes = "Gestionar bienes",
  Interactuar_mercaderes = "Gestionar mercaderes",
  Interactuar_clientes = "Gestionar clientes",
  Test_Imprimir = "Test Comprobar lectura json",
  Quit = "Quit",
}

enum comandosProveedores {
  nuevo_proveedor = "Proveedor nuevo",
  proveedor_existente = "Proveedor ya registrado",
  Volver = "Volver",
}

enum comandosClientes {
  nuevo_cliente = "Cliente nuevo",
  cliente_existente = "Cliente ya registrado",
  Volver = "Volver",
}

enum comandosBienes {
  nuevo_bien = "Bien nuevo",
  bien_existente = "Bien ya registrado",
  Volver = "Volver",
}

function promptInteracturarMercaderes(): void {
  console.clear();
  inquirer
    .prompt({
      type: "list",
      name: "Comandos mercaderes",
      message: "Gestionando Mercaderes:",
      choices: Object.values(comandosProveedores),
    })
    .then((answers) => {
      switch (answers["Comandos mercaderes"]) {
        case comandosProveedores.nuevo_proveedor:
          Mercader.crear((mercader, error) => {
            if (error) {
              console.error("Error al crear mercader:", error.message);
            } else if (mercader !== undefined) {
              mercaderes.add(mercader);
              console.log("Mercader creado y añadido exitosamente");
            } else {
              console.log("Error al crear mercader");
            }
          });
          break;
        case comandosProveedores.proveedor_existente:
          console.log("LLamada a modificar proveedor");
          menuPrincipal();
          break;
        case comandosProveedores.Volver:
          menuPrincipal();
          break;
      }
    });
}

function promptInteracturarBienes(): void {
  console.clear();
  inquirer
    .prompt({
      type: "list",
      name: "Comandos bienes",
      message: "Gestionando bienes:",
      choices: Object.values(comandosBienes),
    })
    .then((answers) => {
      switch (answers["Comandos bienes"]) {
        case comandosBienes.nuevo_bien:
          ElementoAlmacen.crear((elemento, error) => {
            if (error) {
              console.error("Error al crear elemento:", error.message);
            } else if (elemento !== undefined) {
              inventario.add(elemento);
              console.log("Elemento creado y añadido exitosamente");
            } else {
              console.log("Error al crear elemento");
            }
          });
          break;
        case comandosBienes.bien_existente:
          console.log("Llamada a modificar bien");
          menuPrincipal();
          break;
        case comandosBienes.Volver:
          menuPrincipal();
          break;
      }
    });
}

function promptInteracturarClientes(): void {
  console.clear();
  inquirer
    .prompt({
      type: "list",
      name: "Comandos clientes",
      message: "Gestionando clientes:",
      choices: Object.values(comandosClientes),
    })
    .then((answers) => {
      switch (answers["Comandos clientes"]) {
        case comandosClientes.nuevo_cliente:
          Cliente.crear((cliente, error) => {
            if (error) {
              console.error("Error al crear cliente:", error.message);
            } else if (cliente !== undefined) {
              clientes.add(cliente);
              console.log("Cliente creado y añadido exitosamente");
            } else {
              console.log("Error al crear cliente");
            }
          });
          break;
        case comandosClientes.cliente_existente:
          console.log("Llamada a modificar cliente");
          menuPrincipal();
          break;
        case comandosProveedores.Volver:
          menuPrincipal();
          break;
      }
    });
}

function menuPrincipal(): void {
  console.clear();
  inquirer
    .prompt({
      type: "list",
      name: "Comandos principales",
      message: "Seleccione Accion: ",
      choices: Object.values(comandosPrincipales),
    })
    .then((answers) => {
      switch (answers["Comandos principales"]) {
        case comandosPrincipales.Interactuar_bienes:
          promptInteracturarBienes();
          break;
        case comandosPrincipales.Interactuar_mercaderes:
          promptInteracturarMercaderes();
          break;
        case comandosPrincipales.Interactuar_clientes:
          promptInteracturarClientes();
          break;
        case comandosPrincipales.Quit:
          break;

        case comandosPrincipales.Test_Imprimir:
          inventario.ImprimirTest();
          clientes.ImprimirTest();
          mercaderes.ImprimirTest();
      }
    });
}

const inventario: Inventario = Inventario.getGestorInstancia();
const clientes: GestorClientes = GestorClientes.getGestorInstancia();
const mercaderes: GestorMercaderes = GestorMercaderes.getGestorInstancia();

if(process.env.NODE_ENV !== "test"){
  menuPrincipal();
}

