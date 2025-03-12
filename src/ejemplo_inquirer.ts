import inquirer from 'inquirer';


enum comandosPrincipales {
    Interactuar_clientes = "Interacturar con un cliente",
    Interactuar_proveedores = "Interacturar con un proveedor",
    Quit = "Quit"
}

enum comandosProveedores {
    nuevo_proveedor = "Proveedor nuevo",
    proveedor_existente = "Proveedor registrado",
    Quit = "Quit"
}

enum comandosClientes {
    nuevo_cliente = "Cliente nuevo",
    cliente_existente = "Cliente registrado",
    Quit = "Quit"
}


function promptInteracturarProveedores(): void {
    console.clear();
    inquirer.prompt({ type: "list", name: "interact", message: "Nuevo proveedor o proveedor existente:", choices: Object.values(comandosProveedores)})
    .then(answers => {
        switch(answers["interact"]){
            case comandosProveedores.nuevo_proveedor:
                console.log("LLamada a crear proveedor")
                promptUser();
                break;
            case comandosProveedores.proveedor_existente:
                console.log("LLamada a modificar proveedor")
                promptUser();
                break;
        }
    }) 
}

function promptInteracturarClientes(): void {
    console.clear();
    inquirer.prompt({ type: "list", name: "command", message: "Nuevo cliente o cliente existente:", choices: Object.values(comandosClientes)})
    .then(answers => {
        switch(answers["command"]){
            case comandosClientes.nuevo_cliente:
                console.log("Llamada a crear Cliente")
                promptUser();
                break;
            case comandosClientes.cliente_existente:
                console.log("Llamada a modificar cliente")  
                promptUser();
                break;
        }
    })
}
  

function promptUser(): void {
    console.clear();
    inquirer.prompt({
      type: "list",
      name: "command",
      message: "Seleccione Accion: ",
      choices: Object.values(comandosPrincipales), 
    }).then(answers => {
      switch(answers["command"]){
        case comandosPrincipales.Interactuar_clientes:
          promptInteracturarClientes();
          break;
        case comandosPrincipales.Interactuar_proveedores:
          promptInteracturarProveedores();
          break;
      }
    })
}
  promptUser();