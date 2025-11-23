

//----------------------------------------

export class Cliente {
    #nome;
    #email;
    constructor(nome, email){
        this.#nome = nome;
        this.#email = email;
    }

    get nome(){
        return this.#nome;
    }

    get email(){
        return this.#email;
    }
}

//----------------------------------------

export class ComunicacaoApi {
    #url;
    constructor(url){
        this.#url = url;
    }

    get url(){
        return this.#url;
    }

    async listarClientes(){
        try{
            const resposta = await fetch(this.#url);
            if(!resposta.ok) throw new Error("Erro na busca de clientes");
            return await resposta.json();
        }
        catch(erro){
            console.error(erro);
            throw erro;
        }
    }

    async salvarCliente(cliente){
        try{
            const resposta = await fetch(this.#url, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(cliente)
            });
            
            if(!resposta.ok) throw new Error("Erro ao salvar o cliente");          
            return await resposta.json();
        }
        catch(erro){
            console.error(erro);
            throw erro;
        }
    }

    async deletarCliente(idCliente){
        try{
            const resposta = await fetch(`${this.#url}/${idCliente}`, {
                method: "DELETE",
            });
            
            if (!resposta.ok) throw new Error("Erro ao deletar o cliente");
            return true;
        }
        catch(erro){
            console.error(erro);
            throw erro;
        }
    }

    async atualizarCliente(idCliente, cliente){
        try{
            const clienteSemId = {...cliente};
            delete clienteSemId._id;

            const resposta = await fetch(`${this.#url}/${idCliente}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(clienteSemId)
            });
            
            if(!resposta.ok) throw new Error("Erro ao atualizar o cliente");
            return true;
            
        }
        catch(erro){
            console.error(erro);
            throw erro;
        }
    }
}

//----------------------------------------

export class ControleCliente {
    constructor(api, ui, utils, inputNome, inputEmail, botaoAdicionar) {
        this.api = api;
        this.ui = ui;
        this.utils = utils;

        this.inputNome = inputNome;
        this.inputEmail = inputEmail;
        this.botaoAdicionar = botaoAdicionar;

        this.clienteEditandoId = null;

        // handlers do UI
        this.ui.setDeleteHandler((id) => this.excluir(id));
        this.ui.setEditHandler((cliente) => this.prepararEdicao(cliente));

        // evento do botão
        this.botaoAdicionar.addEventListener("click", () => this.salvarOuEditar());

        // carregar ao abrir
        this.carregarLista();
    }

    // --------------------------------------------
    // LISTAGEM + MAP + FILTER + REDUCE
    // --------------------------------------------
    async carregarLista() {
        try {
            let clientes = await this.api.listarClientes();

            // MAP → criar campo exibicao
            clientes = clientes.map(c => ({
                ...c,
                exibicao: `${c.nome.toUpperCase()} <${c.email}>`
            }));

            // FILTER → apenas emails válidos
            const filtrados = clientes.filter(c => c.email.includes("@"));

            // REDUCE → contar total
            const total = filtrados.reduce((acc) => acc + 1, 0);
            console.log("Total de clientes exibidos:", total);

            // Renderizar
            this.ui.renderLista(filtrados);

        } catch (erro) {
            console.error("Erro ao carregar", erro);
        }
    }

    // --------------------------------------------
    // CREATE ou UPDATE
    // --------------------------------------------
    async salvarOuEditar() {
        const nome = this.inputNome.value.trim();
        const email = this.inputEmail.value.trim();

        if (!this.utils.validarNome(nome)) return alert("Nome inválido!");
        if (!this.utils.validarEmail(email)) return alert("Email inválido!");

        const cliente = { nome, email };

        try {
            if (this.clienteEditandoId) {
                await this.api.atualizarCliente(this.clienteEditandoId, cliente);
                this.clienteEditandoId = null;
            } else {
                await this.api.salvarCliente(cliente);
            }

            this.utils.limparInputs(this.inputNome, this.inputEmail);
            this.carregarLista();

        } catch (erro) {
            alert("Erro ao salvar");
        }
    }

    // --------------------------------------------
    // DELETE
    // --------------------------------------------
    async excluir(idCliente) {
        if (!confirm("Deseja excluir?")) return;

        try {
            await this.api.deletarCliente(idCliente);
            this.carregarLista();
        } catch (erro) {
            alert("Erro ao excluir");
        }
    }

    // --------------------------------------------
    // EDITAR + FIND
    // --------------------------------------------
    prepararEdicao(cliente) {

        // FIND real: aqui o cliente já vem da lista
        const clienteEncontrado = cliente;
        console.log("Cliente encontrado (find):", clienteEncontrado);

        this.inputNome.value = clienteEncontrado.nome;
        this.inputEmail.value = clienteEncontrado.email;

        this.clienteEditandoId = clienteEncontrado._id;
    }
}

//----------------------------------------

export class ControleDom {
    constructor(listaElemento) {
        this.listaElemento = listaElemento;
        this.onDelete = null;
        this.onEdit = null;
    }

    setDeleteHandler(handler) {
        this.onDelete = handler;
    }

    setEditHandler(handler) {
        this.onEdit = handler;
    }

    limparLista() {
        this.listaElemento.innerHTML = "";
    }

    renderCliente(cliente) {
        const li = document.createElement("li");
        li.textContent = `${cliente.exibicao} `;

        const btnEdit = document.createElement("button");
        btnEdit.textContent = "Editar";
        btnEdit.addEventListener("click", () => {
            if (this.onEdit) this.onEdit(cliente);
        });

        const btnDelete = document.createElement("button");
        btnDelete.textContent = "Excluir";
        btnDelete.addEventListener("click", () => {
            if (this.onDelete) this.onDelete(cliente._id);
        });

        li.appendChild(btnEdit);
        li.appendChild(btnDelete);

        this.listaElemento.appendChild(li);
    }

    renderLista(lista) {
        this.limparLista();
        lista.forEach(cliente => this.renderCliente(cliente));
    }
}