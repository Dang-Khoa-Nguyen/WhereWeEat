from fastapi import FastAPI


app = FastAPI()

@app.get("/")
async def home():
    return {"message": "Hello world"}

@app.get("/recommend")
async def recommendation_restaurant():
    return 