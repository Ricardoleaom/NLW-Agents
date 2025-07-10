const apiKeyInput = document.getElementById('apiKey');
const gameSelect = document.getElementById('gameSelect');
const questionInput = document.getElementById('questionInput');
const askButton = document.getElementById('askButton');
const form = document.getElementById('form');
const aiResponse = document.getElementById('aiResponse');

const markdownToHTML = (text) => {
    const converter = new showdown.Converter();
    return converter.makeHtml(text);
}

// AIzaSyCuf0JujbG4aYdw1x3kQizbQGVLHzj8Ia4
const perguntarAI = async (question, game, apiKey) => {
    const model = "gemini-2.5-flash";
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const perguntaLOL = `
    ## Especialidade
    Você é um especialista em ${game} e deve responder perguntas sobre o jogo ${game}.
    
    ## Tarefa
    Você deve responder a pergunta do usuário sobre o jogo, estrategicas, build e dicas.

    ## Regras
    - Se Você não souber a resposta, diga que não sabe ou que não tem certeza e não tente inventar uma resposta.
    - Se a pergunta não for sobre o jogo, diga que não é um especialista nesse assunto.
    - COnsidere a data atual ${new Date().toLocaleDateString()} para responder perguntas sobre atualizações, eventos ou mudanças no jogo.
    - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para fornecer informações precisas e relevantes.
    - Nunca responder itens que vc não tenha certeza, sempre busque informações atualizadas.

    ## Resposta
    - Economize na resposta, seja direto e claro, evite rodeios. Responda apenas o necessário para responder a pergunta do usuário com no maximo 500 caracteres.
    - Responda em markdown.
    - Não precisa fazer nenhuma saudação ou introdução, vá direto ao ponto.
    
    ## Exemploss de resposta
    - Pergunta do usuario: "Qual é a melhor build para o campeão X no patch atual?"
    - Resposta: "A melhor build para o campeão X no patch atual é: \n\n **Itens:**\n\n coloque os itens aqui.\n\n**Runas:**\n\n coloque as runas aqui.\n\n **Estratégia:**\n\n coloque a estratégia aqui.\n\n Lembre-se de que as builds podem variar dependendo do estilo de jogo e da composição da equipe, então adapte conforme necessário."

    ---
    Aqui esta a pergunta do usuário:
    ${question}`;

    const perguntaCS = `

    `;

    const perguntaFC25 = `

    `;

    const perguntaCOD = `
    
    `;

    let pergunta = '';
    if (game === 'League of Legends') {
        pergunta = perguntaLOL;
    } else if (game === 'Counter-Strike: Global Offensive') {
        pergunta = perguntaCS;
    } else if (game === 'Fifa 25') {
        pergunta = perguntaFC25;
    } else if (game === 'Call of Duty') {
        pergunta = perguntaCOD;
    } else {
        throw new Error('Jogo não suportado');
    }

    const contents = [{
        role: 'user',
        parts:[{
            text: pergunta
        }]
    }]

    const tools = [{
        google_search: {}
    }];

    //chamada da API
    const response = await fetch(geminiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contents, tools }),
    });
    const data = await response.json();
     return data.candidates[0].content.parts[0].text;

}
// Função para enviar o formulário e obter a resposta da IA
    const enviarFormulario = async (event) => {
    event.preventDefault();
    const apiKey = apiKeyInput.value;
    const game = gameSelect.value;
    const question = questionInput.value;

    if(apiKey === '' || game === '' || question === '') {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    askButton.disabled = true;
    askButton.textContent = 'Perguntando...';
    askButton.classList.add('loading');

    try {
        const text = await perguntarAI(question, game, apiKey);
        aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text);
        aiResponse.classList.remove('hidden');

    } catch (error) {
        console.error('Erro ao perguntar à IA:', error);
 } finally {
    askButton.disabled = false;
    askButton.textContent = 'Perguntar';
    askButton.classList.remove('loading');
 }

}

form.addEventListener('submit', enviarFormulario);