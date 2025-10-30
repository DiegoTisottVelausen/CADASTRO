//Seleciona a nossa ul com a lista de clientes no HTML
const clientes = document.getElementById("listaClientes");

//Faz uma requisição GET para a API externa pra buscar todas os cadastros
fetch("https://crudcrud.com/api/7638e3dcf97a4df1985aacf4123f1cbd/cadastro")
.then(resposta => resposta.json()) //Converte o corpo da resposta em JSON
.then((listaDeClientes) => {
    //Itera sobre cada cadastro do array
    listaDeClientes.forEach(cadastro => {
        //Cria um novo elemento de lista (<li>) para cada cadastro
        const item = document.createElement("li");
        item.setAttribute("id", cadastro._id);
        //Define o conteúdo HTML do item, incluindo descrição e botão
        item.innerHTML = `${cadastro.nome} - ${cadastro.email} - <button class="btn-delete" data-id="${cadastro._id}">X</button>`;
        //Adiciona o novo item a lista de tarefas no HTML
        clientes.appendChild(item);

       
        document.querySelectorAll(".btn-delete").forEach(botao => {
            botao.addEventListener("click", () => {
                const id = botao.getAttribute("data-id");

                fetch(`https://crudcrud.com/api/7638e3dcf97a4df1985aacf4123f1cbd/cadastro/${cadastro._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
                })
                .then(res => {
                    if (!res.ok) throw new Error("Erro ao deletar cadastro");
                    console.log(`Cadastro ${id} deletado com sucesso!`);
                    document.getElementById(id).remove(); // Remove o item do DOM
                })
                .catch(err => console.error("Erro na requisição DELETE:", err));
            });
            });
        });
               
        }); 

//Adiciona um ouvinte de evento de click no botão "adicionar"
document.getElementById("add").addEventListener("click", ()=>{
    //Pega a descrição que o usuário adicionou no input com o ID cadastro
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    
    //Faz uma requisição POST para a API externa para criar o cadastro
    fetch
    ("https://crudcrud.com/api/7638e3dcf97a4df1985aacf4123f1cbd/cadastro", 
        {
            //Definido como POST, mas podemos usara GET, POST, PUT e DELETE
            method: "POST",
            //Definimos os cabeçalhos da requisição, com  tipo do conteúdo JSON
            headers: 
                {
                "Content-Type": "application/json"
                },
            //Convertemos um objeto JS para uma string JSON e passamos no corpo
            body: JSON.stringify({nome: nome, email: email})
        }
    )
        .then(resposta => resposta.json())
        .then((cadastro)=>{
            //Cria um novo elemento de lista (<li>) para cada cadastro
            const item = document.createElement("li");
            item.setAttribute("id", cadastro._id);
            //Define o conteúdo HTML do item, incluindo descrição e botão
            item.innerHTML = `${cadastro.nome} - ${cadastro.email} - <button class="btn-delete" data-id="${cadastro._id}">X</button>`;
            //Adiciona o novo item a lista de cadastro no HTML
            clientes.appendChild(item);

            document.getElementById("nome").value = "";
            document.getElementById("email").value = "";
                
            item.querySelector(".btn-delete").addEventListener("click", () => {
                

                fetch(`https://crudcrud.com/api/7638e3dcf97a4df1985aacf4123f1cbd/cadastro/${cadastro._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
                })
                .then(res => {
                    if (!res.ok) throw new Error("Erro ao deletar cadastro");
                    console.log(`Cadastro ${cadastro._id} deletado com sucesso!`);
                    item.remove(); // Remove o item do DOM
                })
                .catch(err => console.error("Erro na requisição DELETE:", err));
            });
        });

})

