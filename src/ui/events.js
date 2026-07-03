
import { recommendMovies } from "../recommendation/recommendMovie.js";
import { renderWatchedMovies } from "./renderWatchedMovies.js";
import { generateRecommendations } from "../recommendation/generateRecommendations.js";
import { getSelectedUser } from "./userSelect.js";

export function registerEvents(model, context) {
    console.log("registrando eventos...")

    const select = document.getElementById("usersSelect")

    select.addEventListener("change", () => {
        const user = getSelectedUser(context);

        renderWatchedMovies(user);
        console.log(user.id);
        generateRecommendations(
            user.id,
            model,
            context,  
        )
    });

}