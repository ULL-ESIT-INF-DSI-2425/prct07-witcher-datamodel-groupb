import inquirer from "inquirer";

import Inventario from "./Gestores/Inventario.js";
import GestorClientes from "./Gestores/GestorClientes.js";
import GestorMercaderes from "./Gestores/GestorMercaderes.js";

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
          mercaderes.crear();
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
          inventario.crear();
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
          clientes.crear();
          //menuPrincipal();
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

let inventario: Inventario = Inventario.getGestorInstancia();
let clientes: GestorClientes = GestorClientes.getGestorInstancia();
let mercaderes: GestorMercaderes = GestorMercaderes.getGestorInstancia();
menuPrincipal();
