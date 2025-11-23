import { ComunicacaoApi, ControleCliente, ControleDom } from "./classes.js";
import * as utils from "./utils.js";

const inputNome = document.getElementById("nome");
const inputEmail = document.getElementById("email");
const btnAdd = document.getElementById("btnAdd");
const listaClientes = document.getElementById("listaClientes");

// COLOQUE SEU TOKEN DO CRUDCRUD AQUI ↓↓↓
const urlCrud = "https://crudcrud.com/api/ea664bbbcc334621874e44a4e6bba53d/clientes";

const api = new ComunicacaoApi(urlCrud);
const ui = new ControleDom(listaClientes);

new ControleCliente(api, ui, utils, inputNome, inputEmail, btnAdd);