
export function validarEmail(email) {
    const padrao = /\S+@\S+\.\S+/;
    // /\S+@\S+\.\S+/ é uma expressão regular que valida o formato básico de um email
    // \S  → qualquer caractere que NÃO seja espaço
    // \S+ → um ou mais caracteres sem espaço
    // @   → símbolo arroba (obrigatório)
    // \.  → ponto literal
    // Ex: texto@texto.texto
    return padrao.test(email);
}

export function validarNome(nome) {
    return nome.trim().length >= 2;
}

export function limparInputs(...inputs) {
    inputs.forEach(input => input.value = "");
}