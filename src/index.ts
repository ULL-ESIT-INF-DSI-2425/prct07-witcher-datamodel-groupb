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
import GestorTransacciones from "./Gestores/GestorTransacciones.js";
import Transaccion from "./Entidades/Transaccion.js";

enum comandosPrincipales {
  Vender = "Vender",
  Comprar = "Comprar",
  Devolver = "Devolver",
  Gestionar = "Gestionar Base de datos",
  Informes = "Informes",
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

function promptVender(): void {
  console.clear();
  inquirer
    .prompt({
      type: "list",
      name: "Vender",
      message: "Seleccione cliente:",
      choices: clientes.getNombres(),
    })
    .then((answers) => {
      const id = parseInt(answers["Vender"].split(" - ")[0]);
      const cliente = clientes.get(id);
      if (cliente === undefined) {
        console.log("Cliente no encontrado");
        return;
      }
      inquirer
        .prompt({
          type: "list",
          name: "Vender",
          message: "Seleccione bien:",
          choices: inventario.getNombres(),
        })
        .then((answers) => {
          const id = parseInt(answers["Vender"].split(" - ")[0]);
          const bien = inventario.get(id);
          if (bien === undefined) {
            console.log("Bien no encontrado");
            return;
          }
          inquirer
            .prompt({
              type: "input",
              name: "Cantidad",
              message: "Introduzca la cantidad a vender:",
            })
            .then((answers) => {
              const cantidad = parseInt(answers["Cantidad"]);
              if(bien.cantidad < cantidad){
                console.log("No hay suficiente cantidad de bienes para vender");
                return;
              }
              try {
                //transacciones.vender(cliente, bien, cantidad);
                inventario.removeBien(bien.ID, cantidad);
                let bien_vendido = new ElementoAlmacen(bien.bien, cantidad);
                transacciones.add(new Transaccion(transacciones.getTransaccionID(), new Date(), bien_vendido, cliente, false));
                console.log("Venta realizada exitosamente");
              } catch (error) {
                if (error instanceof Error) {
                  console.log(error.message);
                } else {
                  console.log("Unknown error");
                }
              }
            });
        });
    });
  }

function promptComprar(): void {
  console.clear();
  inquirer
    .prompt({
      type: "list",
      name: "Comprar",
      message: "Seleccione mercader:",
      choices: mercaderes.getNombres(),
    })
    .then((answers) => {
      const id = parseInt(answers["Comprar"].split(" - ")[0]);
      const mercader = mercaderes.get(id);
      if (mercader === undefined) {
        console.log("Mercader no encontrado");
        return;
      }
      inquirer
        .prompt({
          type: "list",
          name: "Comprar",
          message: "Seleccione bien:",
          choices: inventario.getNombres(),
        })
        .then((answers) => {
          const id = parseInt(answers["Comprar"].split(" - ")[0]);
          const bien = inventario.get(id);
          if (bien === undefined) {
            console.log("Bien no encontrado");
            return;
          }
          inquirer
            .prompt({
              type: "input",
              name: "Cantidad",
              message: "Introduzca la cantidad a comprar:",
            })
            .then((answers) => {
              const cantidad = parseInt(answers["Cantidad"]);
              try {
                //transacciones.comprar(mercader, bien, cantidad);
                inventario.addBien(bien.ID, cantidad);
                let bien_comprado = new ElementoAlmacen(bien.bien, cantidad);
                transacciones.add(new Transaccion(transacciones.getTransaccionID(), new Date(), bien_comprado, mercader, false));
                console.log("Compra realizada exitosamente");
              } catch (error) {
                if (error instanceof Error) {
                  console.log(error.message);
                } else {
                  console.log("Unknown error");
                }
              }
            });
        });
    });
}

function promptDevolverCliente(): void {
  console.clear();
  inquirer
    .prompt({
      type: "list",
      name: "DevolverMercader",
      message: "Seleccione Cliente al que se vendió:",
      choices: transacciones.getClientes(),
    })
    .then((answers) => {
      const id = parseInt(answers["DevolverMercader"].split(" - ")[0]);
      const cliente = clientes.get(id);
      if (cliente === undefined) {
        console.log("Cliente no encontrado");
        return;
      }
      inquirer
        .prompt({
          type: "list",
          name: "Devolver",
          message: "Seleccione bien:",
          choices: transacciones.getBienes(cliente),
        })
        .then((answers) => {
          const id = parseInt(answers["Devolver"].split(" - ")[0]);
          const bien = inventario.get(id);
          if (bien === undefined) {
            console.log("Bien no encontrado");
            return;
          }
          inquirer
            .prompt({
              type: "input",
              name: "Cantidad",
              message: "Introduzca la cantidad a devolver:",
            })
            .then((answers) => {
              const cantidad = parseInt(answers["Cantidad"]);
              try {
                //transacciones.devolver(transaccion, bien, cantidad);
                inventario.addBien(bien.ID, cantidad);
                let bien_devuelto = new ElementoAlmacen(bien.bien, cantidad);
                transacciones.add(new Transaccion(transacciones.getTransaccionID(), new Date(), bien_devuelto, cliente, true));
                console.log("Devolucion realizada exitosamente");
              } catch (error) {
                if (error instanceof Error) {
                  console.log(error.message);
                } else {
                  console.log("Unknown error");
                }
              }
            });
        });
    });
}

function promptDevolverMercader(): void {
  console.clear();
  const mercaderNombres = transacciones.getMercaderes();
  //console.log("Mercaderes disponibles:", mercaderNombres); // Debug statement
  if (mercaderNombres.length === 0) {
    console.log("No hay mercaderes disponibles para seleccionar.");
    return;
  }
  inquirer
    .prompt({
      type: "list",
      name: "DevolverMercader",
      message: "Seleccione Mercader al que se compró:",
      choices: mercaderNombres,
    })
    .then((answers) => {
      const id = parseInt(answers["DevolverMercader"].split(" - ")[0]);
      const mercader = mercaderes.get(id);
      if (mercader === undefined) {
        console.log("Mercader no encontrado");
        return;
      }
      const bienNombres = transacciones.getBienes(mercader);
      //console.log("Bienes disponibles:", bienNombres); // Debug statement
      if (bienNombres.length === 0) {
        console.log("No hay bienes disponibles para seleccionar.");
        return;
      }
      inquirer
        .prompt({
          type: "list",
          name: "Devolver",
          message: "Seleccione bien:",
          choices: bienNombres,
        })
        .then((answers) => {
          const id = parseInt(answers["Devolver"].split(" - ")[0]);
          const bien = inventario.get(id);
          if (bien === undefined) {
            console.log("Bien no encontrado");
            return;
          }
          inquirer
            .prompt({
              type: "input",
              name: "Cantidad",
              message: "Introduzca la cantidad a devolver:",
            })
            .then((answers) => {
              const cantidad = parseInt(answers["Cantidad"]);
              try {
                inventario.removeBien(bien.ID, cantidad);
                let bien_devuelto = new ElementoAlmacen(bien.bien, cantidad);
                transacciones.add(new Transaccion(transacciones.getTransaccionID(), new Date(), bien_devuelto, mercader, true));
                console.log("Devolución realizada exitosamente");
              } catch (error) {
                if (error instanceof Error) {
                  console.log(error.message);
                } else {
                  console.log("Unknown error");
                }
              }
            });
        });
    });
}

function Devoluciones(): void {
  console.clear();
  inquirer
    .prompt({
      type: "list",
      name: "Devoluciones",
      message: "Seleccione tipo de devolucion:",
      choices: ["Devolucion de cliente", "Devolucion de mercader", "Volver"],
    })
    .then((answers) => {
      switch (answers["Devoluciones"]) {
        case "Devolucion de cliente":
          promptDevolverCliente();
          break;
        case "Devolucion de mercader":
          promptDevolverMercader();
          break;
        case "Volver":
          menuPrincipal();
          break;
      }
    });
}

function promptTransacciones(): void {
  console.clear();
  inquirer
    .prompt({
      type: "list",
      name: "Transacciones",
      message: "Seleccione tipo de transaccion:",
      choices: ["Ver una transaccion", "Ver todas las transacciones", "Volver"],
    })
    .then((answers) => {
      switch (answers["Transacciones"]) {
        case "Ver una transaccion":
          inquirer
            .prompt({
              type: "input",
              name: "ID",
              message: "Introduzca el ID de la transaccion a ver:",
            })
            .then((answers) => {
              const id = parseInt(answers["ID"]);
              let transaccion:Transaccion = transacciones.get(id);
              if (transaccion === undefined) {
                console.log("Transaccion no encontrada");
                return;
              }
              console.log("Transaccion encontrada:");
              console.log(transaccion.tostring());
            });
          break;
        case "Ver todas las transacciones":
          transacciones.ImprimirTest();
          break;
        case "Volver":
          menuPrincipal();
          break;
      }
    });
}
              


function ModificarInventario(): void {
  console.clear();
  inquirer
    .prompt({
      type: "list",
      name: "ModificarInventario",
      message: "Seleccione tipo de modificacion:",
      choices: ["Bienes", "Mercaderes", "Clientes", "Transacciones", "Volver"],
    })
    .then((answers) => {
      switch (answers["ModificarInventario"]) {
        case "Bienes":
          promptInteracturarBienes();
          break;
        case "Mercaderes":
          promptInteracturarMercaderes();
          break;
        case "Clientes":
          promptInteracturarClientes();
          break;
        case "Transacciones":
          promptTransacciones();
          break;
        case "Volver":
          menuPrincipal();
          break;
      }
    });
}


function promptInformes(): void {
  console.clear();
  inquirer
    .prompt({
      type: "list",
      name: "Informes",
      message: "Seleccione tipo de informe:",
      choices: ["Estado del stock", "Bienes mas vendidos", "Total de ingresos", "Volver"],
    })
    .then((answers) => {
      switch (answers["Informes"]) {
        case "Estado del stock":
          console.log(inventario.buscar());
          break;
        case "Bienes mas vendidos":
          console.log(transacciones.bienesMasVendidos());
          break;
        case "Total de ingresos":
          console.log("Total de ingresos:", transacciones.totalIngresos());
          console.log("Total de gastos:", transacciones.totalGastos());
          break;
        case "Volver":
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
        case comandosPrincipales.Gestionar:
          ModificarInventario();
          break;
        case comandosPrincipales.Quit:
          break;
        case comandosPrincipales.Vender:
          promptVender();
          break;
        case comandosPrincipales.Comprar:
          promptComprar();
          break;
        case comandosPrincipales.Devolver:
          Devoluciones();
          break;
        case comandosPrincipales.Informes:
          promptInformes();
          break;
      }
    });
}

let inventario: Inventario = Inventario.getGestorInstancia();
let clientes: GestorClientes = GestorClientes.getGestorInstancia();
let mercaderes: GestorMercaderes = GestorMercaderes.getGestorInstancia();
let transacciones: GestorTransacciones = GestorTransacciones.getGestorInstancia();

if(process.env.NODE_ENV !== "test"){
  menuPrincipal();
}

