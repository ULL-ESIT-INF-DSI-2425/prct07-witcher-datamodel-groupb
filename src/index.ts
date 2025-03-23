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
  proveedor_existente = "Modificar proveedor",
  eliminar_proveedor = "Eliminar proveedor",
  buscar_proveedor = "Buscar proveedor",
  Volver = "Volver",
}

enum comandosClientes {
  nuevo_cliente = "Cliente nuevo",
  cliente_existente = "Modificar cliente",
  eliminar_cliente = "Eliminar cliente",
  buscar_cliente = "Buscar cliente",
  Volver = "Volver",
}

enum comandosBienes {
  nuevo_bien = "Bien nuevo",
  bien_existente = "Modificar bien",
  eliminar_bien = "Eliminar bien",
  buscar_bien = "Buscar bien",
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
          Mercader.crear((mercader, error) => {
            if (error) {
              console.error("Error al crear mercader:", error.message);
            } else if (mercader !== undefined) {
              mercaderes.update(mercader);
              console.log("Mercader creado y añadido exitosamente");
            } else {
              console.log("Error al crear mercader");
            }
          });
          break;
        
        case comandosProveedores.eliminar_proveedor:
          //Preguntar solamente el id
          inquirer
            .prompt({
              type: "input",
              name: "ID",
              message: "Introduzca el ID del mercader a eliminar",
            })
            .then((answers) => {
              const id = parseInt(answers["ID"]);
              try {
                mercaderes.remove(id);
                console.log("Mercader eliminado exitosamente");
              } catch (error) {
                if (error instanceof Error) {
                  console.log(error.message);
                } else {
                  console.log("Unknown error");
                }
              }
            });
          break;

        case comandosProveedores.buscar_proveedor:
          inquirer
            .prompt({
              type: "list",
              name: "Filtro",
              message: "Seleccione filtro:",
              choices: ["Nombre", "Tipo", "Ubicacion"],
            })
            .then((answers: { Filtro: string }) => {
              const filtro = answers.Filtro;
              inquirer
                .prompt({
                  type: "input",
                  name: "Valor",
                  message: "Introduzca el valor a buscar:",
                })
                .then((answers: { Valor: string }) => {
                  const valor = answers["Valor"];
                  const mercaderesFiltrados = mercaderes.buscar(filtro, valor);
                  if (mercaderesFiltrados.length === 0) {
                    console.log("No se encontraron mercaderes con ese filtro");
                  } else {
                    console.log("Mercaderes encontrados:");
                    mercaderesFiltrados.forEach((mercader) => {
                      console.log(mercader.tostring());
                    });
                  }
                });
            });
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
          ElementoAlmacen.crear((elemento, error) => {
            if (error) {
              console.error("Error al crear elemento:", error.message);
            } else if (elemento !== undefined) {
              inventario.update(elemento);
              console.log("Elemento creado y añadido exitosamente");
            } else {
              console.log("Error al crear elemento");
            }
          });
          break;

        case comandosBienes.eliminar_bien:
          //Preguntar solamente el id
          inquirer
            .prompt({
              type: "input",
              name: "ID",
              message: "Introduzca el ID del bien a eliminar",
            })
            .then((answers) => {
              const id = parseInt(answers["ID"]);
              try {
                inventario.remove(id);
                console.log("Bien eliminado exitosamente");
              } catch (error) {
                if (error instanceof Error) {
                  console.log(error.message);
                } else {
                  console.log("Unknown error");
                }
              }
            });
          break;
        
        case comandosBienes.buscar_bien:
          inquirer
            .prompt({
              type: "list",
              name: "Filtro",
              message: "Seleccione filtro:",
              choices: ["Nombre", "Material", "Descripcion"],
            })
            .then((answers: { Filtro: string }) => {
              const filtro = answers.Filtro;
              inquirer
                .prompt({
                  type: "input",
                  name: "Valor",
                  message: "Introduzca el valor a buscar:",
                })
                .then((answers: { Valor: string }) => {
                  const valor = answers["Valor"];
                  const elementosFiltrados = inventario.buscar(filtro, valor);
                  if (elementosFiltrados.length === 0) {
                    console.log("No se encontraron elementos con ese filtro");
                  } else {
                    console.log("Elementos encontrados:");
                    elementosFiltrados.forEach((elemento) => {
                      console.log(elemento.tostring());
                    });
                  }
                });
            });
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
          Cliente.crear((cliente, error) => {
            if (error) {
              console.error("Error al crear cliente:", error.message);
            } else if (cliente !== undefined) {
              clientes.update(cliente);
              console.log("Cliente creado y añadido exitosamente");
            } else {
              console.log("Error al crear cliente");
            }
          });
          break;

        case comandosClientes.eliminar_cliente:
          //Preguntar solamente el id
          inquirer
            .prompt({
              type: "input",
              name: "ID",
              message: "Introduzca el ID del cliente a eliminar",
            })
            .then((answers) => {
              const id = parseInt(answers["ID"]);
              try {
                clientes.remove(id);
                console.log("Cliente eliminado exitosamente");
              } catch (error) {
                if (error instanceof Error) {
                  console.log(error.message);
                } else {
                  console.log("Unknown error");
                }
              }
            });
          break;

        case comandosClientes.buscar_cliente:
          inquirer
            .prompt({
              type: "list",
              name: "Filtro",
              message: "Seleccione filtro:",
              choices: ["Nombre", "Raza", "Ubicacion"],
            })
            .then((answers: { Filtro: string }) => {
              const filtro = answers.Filtro;
              inquirer
                .prompt({
                  type: "input",
                  name: "Valor",
                  message: "Introduzca el valor a buscar:",
                })
                .then((answers: { Valor: string }) => {
                  const valor = answers["Valor"];
                  const clientesFiltrados = clientes.buscar(filtro, valor);
                  if (clientesFiltrados.length === 0) {
                    console.log("No se encontraron clientes con ese filtro");
                  } else {
                    console.log("Clientes encontrados:");
                    clientesFiltrados.forEach((cliente) => {
                      console.log(cliente.tostring());
                    });
                  }
                });
            });
          break;

        case comandosClientes.Volver:
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

