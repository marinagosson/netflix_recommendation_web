import { loadMovies } from "./services/movieService.js";
import { loadUsers } from "./services/userService.js";
import { loadHistory } from "./services/historyService.js";
import { makeContext } from "./context/makeContext.js";

import { createTrainingData } from "./training/createTrainingData.js";
import { configureNeuralNetAndTrain } from "./training/configureNeural.js"

import { buildMoviesVector } from "./vectorizers/movieVectorizer.js"; 
import { buildUsersVector } from "./vectorizers/userVectorizer.js";

import { recommendMovies } from "./recommendation/recommendMovie.js";

import { renderUsers } from "./ui/renderUsers.js";

import { registerEvents } from "./ui/events.js";
import { updateStatus } from "./ui/status.js";
import { renderWatchedMovies } from "./ui/renderWatchedMovies.js";

import { enableHorizontalScroll } from "./ui/enableHorizontalScroll.js";

import { getSelectedUser } from "./ui/userSelect.js";

import { generateRecommendations } from "./recommendation/generateRecommendations.js";

let _globalCtx = {};

init();

async function init() {

    enableHorizontalScroll(".horizontal-list");

    const application =document.getElementById("application");
    application.style.display = "none";

    updateStatus("⏳","Carregando dados...")

    // passo 1: obter o data
    const movies = await loadMovies();
    const users = await loadUsers();
    const history = await loadHistory();

    // passo 2: montar o contexto
    // prepara os dados para o restante da aplicacao consiga usar e acessar de forma rapida
    // centraliza todos os relacionamentos, estatisticas e indices necessarios para proximas
    // etapas nao recalcular essas informacoes
    const context = makeContext(
        movies,
        users,
        history
    );
        
    updateStatus("⚙️","Gerando vetores...")

    renderUsers(context.usersWithHistory) 

    const selectedUser = getSelectedUser(context);

    renderWatchedMovies(selectedUser);

    // passo 3: codificacao dos filmes transformando em vetores
    buildMoviesVector(context)

    // passo 4: condificacao os usuarios transformando em vetores
    buildUsersVector(context) 

    _globalCtx = context

    updateStatus("🧠", "Treinando rede neural...");
    
    // passo 5: gerar os dados de treinamento
    const trainData = createTrainingData(context);

    // passo 6: criar rede neural e treinar os modelos
    const model = await configureNeuralNetAndTrain(trainData)

    generateRecommendations(selectedUser.id, model, context, 10)

    registerEvents(
        model,
        context
    );

    updateStatus("✅", "Modelo treinado.", true);
    
    application.style.display = "block";
    
}