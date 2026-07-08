export const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:3000"
        : "https://netflix-recommendation-api-r15g.onrender.com";

export const BATCH_SIZE = 100;