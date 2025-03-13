import inquirer from 'inquirer';


enum comandosPrincipales {
    Interactuar_bienes = "Gestionar bienes",
    Interactuar_mercaderes = "Gestionar mercaderes",
    Interactuar_clientes = "Gestionar clientes",
    Quit = "Quit"
}

enum comandosProveedores {
    nuevo_proveedor = "Proveedor nuevo",
    proveedor_existente = "Proveedor ya registrado",
    Quit = "Quit"
}

enum comandosClientes {
    nuevo_cliente = "Cliente nuevo",
    cliente_existente = "Cliente ya registrado",
    Quit = "Quit"
}

enum comandosBienes {
    nuevo_bien = "Bien nuevo",
    bien_existente = "Bien ya registrado",
    Quit = "Quit"
}


function promptInteracturarMercaderes(): void {
    console.clear();
    inquirer.prompt({ type: "list", name: "Comandos mercaderes", message: "Gestionando Mercaderes:", 
        choices: Object.values(comandosProveedores)})
    .then(answers => {
        switch(answers["Comandos mercaderes"]){
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

function promptInteracturarBienes(): void {
    console.clear();
    inquirer.prompt({ type: "list", name: "Comandos bienes", message: "Gestionando bienes:", 
        choices: Object.values(comandosBienes)})
    .then(answers => {
        switch(answers["Comandos bienes"]){
            case comandosBienes.nuevo_bien:
                console.log("Llamada a crear bien")
                promptUser();
                break;
            case comandosBienes.bien_existente:
                console.log("Llamada a modificar bien")  
                promptUser();
                break;
        }
    })
}

function promptInteracturarClientes(): void {
    console.clear();
    inquirer.prompt({ type: "list", name: "Comandos clientes", message: "Gestionando clientes:", 
        choices: Object.values(comandosClientes)})
    .then(answers => {
        switch(answers["Comandos clientes"]){
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
        name: "Comandos principales",
        message: "Seleccione Accion: ",
        choices: Object.values(comandosPrincipales), 
    }).then(answers => {
        switch(answers["Comandos principales"]){
            case comandosPrincipales.Interactuar_bienes:
                promptInteracturarBienes();
                break;
            case comandosPrincipales.Interactuar_mercaderes:
                promptInteracturarMercaderes();
                break;
            case comandosPrincipales.Interactuar_clientes:
                promptInteracturarClientes();
                break;
        }
    })
}

    promptUser();