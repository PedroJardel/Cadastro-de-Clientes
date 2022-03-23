const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const formularios = $$(".form-control")
//------------------Formulário Cadastro Cliente------------------//
const formularioCliente = $("#formCliente")
const txtNome = $("#nome")
const txtCpf = $("#cpf")
const txtRg = $("#rg")
const txtCnpj = $("#cnpj")
const txtIe = $("#ie")
const txtEstado = $("#estado")
const txtCidade = $("#cidade")
const txtBairro = $("#bairro")
const radios = $$(".form-check-input")
const rdPessoaFisica = $("#inlineRadioPf")
const rdPessoaJuridica = $("#inlineRadioPj")

//------------------Formulário Lista Cliente------------------//
const formularioListaCliente = $("#formListaCliente")
const txtNome1 = $("#nome1")
const txtEstado1 = $("#estado1")
const txtCidade1 = $("#cidade1")
const txtBairro1 = $("#bairro1")
var corpoTabela = $("tbody")

//------------------Botões dos Formulários------------------//
const btSalvar = $("#btSalvar")
const btPesquisar = $("#btPesquisar")
const btLimpar = $("#btLimpar")
const btLimparTabela = $("#btRefresh")


//------------------Navbar------------------//
const clickClientes = $("#clientes")
const clickListaClientes = $("#listaClientes")

function mensagemLog(mensagem) {
    alert(mensagem)
}

function validaCliente(cliente) {
    !cliente.nome && mensagemLog("Nome é obrigatório")
    !cliente.tipoPessoa && mensagemLog("Pessoa Física 'F' ou Jurídica 'J' é obrigatório")
    if (cliente.tipoPessoa === 'F') {
        if ((cliente.cpf).length != 0) {
            if ((cliente.cpf).length != 14) {
                mensagemLog("CPF inválido!")
                return false
            }
        } else {
            mensagemLog("CPF é obrigatório!")
            return false
        }
        if ((cliente.rg).length != 0) {
            if ((cliente.rg).length != 10) {
                mensagemLog("RG inválido!")
                return false
            }
        } else {
            mensagemLog("RG é obrigatório!")
            return false
        }
    }
    if (cliente.tipoPessoa === 'J') {
        if ((cliente.cpf).length != 0) {
            if ((cliente.cpf).length != 18) {
                mensagemLog("CNPJ inválido!")
                return false
            }
        } else {
            mensagemLog("CNPJ é obrigatório!")
            return false
        }
        if ((cliente.rg).length != 0) {
            if ((cliente.rg).length != 11) {
                mensagemLog("IE inválido!")
                return false
            }
        } else {
            mensagemLog("IE é obrigatório!")
            return false
        }
    }
    !cliente.bairro && mensagemLog("Bairro é obrigatório")
    !cliente.cidade && mensagemLog("Cidade é obrigatório")
    !cliente.uf && mensagemLog("Estado (UF) é obrigatório")
    return true
}

//--------------Função para aplicar máscara na inserção de dos dados do cliente-------------//
function mascara(i, t) {

    var v = i.value;

    if (isNaN(v[v.length - 1])) {
        i.value = v.substring(0, v.length - 1);
        return;
    }
    if (t == "ie") {
        i.setAttribute("maxlength", "11");
        if (v.length == 9) i.value += "-";
    }
    if (t == "rg") {
        i.setAttribute("maxlength", "10");
    }
    if (t == "cpf") {
        i.setAttribute("maxlength", "14");
        if (v.length == 3 || v.length == 7) i.value += ".";
        if (v.length == 11) i.value += "-";
    }

    if (t == "cnpj") {
        i.setAttribute("maxlength", "18");
        if (v.length == 2 || v.length == 6) i.value += ".";
        if (v.length == 10) i.value += "/";
        if (v.length == 15) i.value += "-";
    }
}

//---------------Eventos para troca de formulário---------------//
clickClientes.addEventListener("click", () => {
    formularioCliente.classList.remove("hide")
    formularioListaCliente.classList.add("hide")
});
clickListaClientes.addEventListener("click", () => {
    formularioListaCliente.classList.remove("hide")
    formularioCliente.classList.add("hide")
});

// (Object => Event  "" == Event  {} -> Desestrutuação {target} -> filho de Event, obrigatóriamente o mesmo nome!)
/* formularios.forEach((item) => {
    item.addEventListener("input", ({ target }) => {
        window.localStorage.setItem(`${target.id}`, `${target.value}`)
    });
}); */

var novoCliente = JSON.parse(localStorage.getItem("Cliente"))

if (novoCliente == null) {
    localStorage.setItem("Cliente", "[]")
    novoCliente = []
}

//-------------Evento para salvar os dados preenchidos no formulário no vetor de objeto novoCliente-------------//
btSalvar.addEventListener("click", (e) => {
    e.preventDefault()
    var cliente = {
        nome: "",
        cpf: "",
        rg: "",
        bairro: "",
        cidade: "",
        uf: "",
        tipoPessoa: ""
    }

    radios.forEach((item) => {
        if (rdPessoaFisica.checked && item.id === "inlineRadioPf") cliente.tipoPessoa = item.value
        if (rdPessoaJuridica.checked && item.id === "inlineRadioPj") cliente.tipoPessoa = item.value
    })
    formularios.forEach((item) => {
        if (item.id === "nome") cliente.nome = item.value.trim().toUpperCase()
        if (rdPessoaFisica.checked) {
            if (item.id === "cpf") cliente.cpf = item.value.trim().toUpperCase()
            if (item.id === "rg") cliente.rg = item.value.trim().toUpperCase()
        }
        if (rdPessoaJuridica.checked) {
            if (item.id === "cnpj") cliente.cpf = item.value.trim().toUpperCase()
            if (item.id === "ie") cliente.rg = item.value.trim().toUpperCase()
        }
        if (item.id === "estado") cliente.uf = item.value.trim().toUpperCase()
        if (item.id === "cidade") cliente.cidade = item.value.trim().toUpperCase()
        if (item.id === "bairro") cliente.bairro = item.value.trim().toUpperCase()
    })
    if (validaCliente(cliente)) {
        novoCliente.push(cliente)
        localStorage.setItem("Cliente", JSON.stringify(novoCliente))
    }
    txtNome.value = ""
    txtCnpj.value = ""
    txtCpf.value = ""
    txtRg.value = ""
    txtIe.value = ""
    txtEstado.value = ""
    txtCidade.value = ""
    txtBairro.value = ""
});

function desabilitaPJ() {
    txtCnpj.value = ""
    txtIe.value = ""
    txtCpf.removeAttribute("disabled")
    txtRg.removeAttribute("disabled")
    var disabledCnpj = document.createAttribute("disabled")
    var disabledIe = document.createAttribute("disabled")
    txtCnpj.setAttributeNode(disabledCnpj)
    txtIe.setAttributeNode(disabledIe)
}

function desabilitaPF() {
    txtCpf.value = ""
    txtRg.value = ""
    txtCnpj.removeAttribute("disabled")
    txtIe.removeAttribute("disabled")
    var disabledCpf = document.createAttribute("disabled")
    var disabledRg = document.createAttribute("disabled")
    txtCpf.setAttributeNode(disabledCpf)
    txtRg.setAttributeNode(disabledRg)
}
btPesquisar.addEventListener("click", (e) => {
    corpoTabela.innerHTML = ""
    e.preventDefault()
    for (cliente of novoCliente) {
        if (cliente.nome.trim().toUpperCase() === txtNome1.value.trim().toUpperCase() ||
            cliente.uf.trim().toUpperCase() === txtEstado1.value.trim().toUpperCase() ||
            cliente.cidade.trim().toUpperCase() === txtCidade1.value.trim().toUpperCase() ||
            cliente.bairro.trim().toUpperCase() === txtBairro1.value.trim().toUpperCase()) {
            var linha = document.createElement("tr")
            var campoNome = document.createElement("td")
            var campoTipoPessoa = document.createElement("td")
            var campoEstado = document.createElement("td")
            var campoCidade = document.createElement("td")
            var campoBairro = document.createElement("td")

            var textoNome = document.createTextNode(cliente.nome.trim().toUpperCase())
            var textoTipoPessoa = document.createTextNode(cliente.tipoPessoa.trim().toUpperCase())
            var textoEstado = document.createTextNode(cliente.uf.trim().toUpperCase())
            var textoCidade = document.createTextNode(cliente.cidade.trim().toUpperCase())
            var textoBairro = document.createTextNode(cliente.bairro.trim().toUpperCase())

            campoNome.appendChild(textoNome)
            campoTipoPessoa.appendChild(textoTipoPessoa)
            campoEstado.appendChild(textoEstado)
            campoCidade.appendChild(textoCidade)
            campoBairro.appendChild(textoBairro)

            linha.appendChild(campoNome)
            linha.appendChild(campoTipoPessoa)
            linha.appendChild(campoEstado)
            linha.appendChild(campoCidade)
            linha.appendChild(campoBairro)

            corpoTabela.appendChild(linha)
        }
        if (txtBairro1.value == '' && txtCidade1.value == ''
            && txtEstado1.value == '' && txtNome1.value == ''){
            var linha = document.createElement("tr")
            var campoNome = document.createElement("td")
            var campoTipoPessoa = document.createElement("td")
            var campoEstado = document.createElement("td")
            var campoCidade = document.createElement("td")
            var campoBairro = document.createElement("td")

            var textoNome = document.createTextNode(cliente.nome.trim().toUpperCase())
            var textoTipoPessoa = document.createTextNode(cliente.tipoPessoa.trim().toUpperCase())
            var textoEstado = document.createTextNode(cliente.uf.trim().toUpperCase())
            var textoCidade = document.createTextNode(cliente.cidade.trim().toUpperCase())
            var textoBairro = document.createTextNode(cliente.bairro.trim().toUpperCase())

            campoNome.appendChild(textoNome)
            campoTipoPessoa.appendChild(textoTipoPessoa)
            campoEstado.appendChild(textoEstado)
            campoCidade.appendChild(textoCidade)
            campoBairro.appendChild(textoBairro)

            linha.appendChild(campoNome)
            linha.appendChild(campoTipoPessoa)
            linha.appendChild(campoEstado)
            linha.appendChild(campoCidade)
            linha.appendChild(campoBairro)

            corpoTabela.appendChild(linha)
            }
    }
    txtBairro1.value = ""
    txtEstado1.value = ""
    txtCidade1.value = ""
    txtNome1.value = ""
});

btLimpar.addEventListener("click", () => {
    if(confirm("Quer mesmo excluir sua Lista de Clientes ?")){
        localStorage.removeItem("Cliente")
        corpoTabela.innerHTML =""
    }
})

btLimparTabela.addEventListener("click", (e) => {
    e.preventDefault()   
    corpoTabela.innerHTML = ""
})