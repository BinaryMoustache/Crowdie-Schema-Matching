export const env = {
  BACKEND_URL:
    import.meta.env.MODE === "development" ? "http://localhost:8000" : "",
};
