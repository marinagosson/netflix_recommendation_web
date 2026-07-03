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

    updateStatus("📥", "Carregando datasets...");

    // passo 1
    const movies = await loadMovies();
    const users = await loadUsers();
    const history = await loadHistory();

    updateStatus("🧩", "Construindo contexto da aplicação...");

    // passo 2
    const context = makeContext(
        movies,
        users,
        history
    );

    renderUsers(context.usersWithHistory);

    const selectedUser = getSelectedUser(context);

    renderWatchedMovies(selectedUser);

    updateStatus("🎬", "Gerando vetores dos filmes...");

    // passo 3
    buildMoviesVector(context);

    updateStatus("👤", "Gerando vetores dos usuários...");

    // passo 4
    buildUsersVector(context);

    _globalCtx = context;

    updateStatus("📊", "Criando conjunto de treinamento...");

    // passo 5
    const trainData = createTrainingData(context);

    updateStatus("🧠", "Treinando rede neural...");

    // passo 6
    const model = await configureNeuralNetAndTrain(trainData);

    updateStatus("✨", "Gerando recomendações iniciais...");

    // passo 7
    generateRecommendations(
        selectedUser.id,
        model,
        context,
        10
    );

    registerEvents(
        model,
        context
    );

    updateStatus(
        "✅",
        "Sistema inicializado com sucesso.",
        true
    );

    application.style.display = "block";
    
}