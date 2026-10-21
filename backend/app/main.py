from fastapi import FastAPI

app = FastAPI(title="Phantasma Studio API")

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Phantasma Studio API is running"}