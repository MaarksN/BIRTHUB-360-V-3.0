from fastapi import FastAPI
from celery import Celery
import os

app = FastAPI(title="Agent Orchestrator API")

CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")

celery_app = Celery(
    "agent_orchestrator",
    broker=CELERY_BROKER_URL,
    backend=CELERY_RESULT_BACKEND
)

@app.get("/")
def read_root():
    return {"message": "Agent Orchestrator is running"}

@celery_app.task(name="execute_agent")
def execute_agent(agent_name: str, payload: dict):
    # Simulated agent execution
    print(f"Executing agent {agent_name} with payload: {payload}")
    return {"agent": agent_name, "status": "executed", "payload_processed": payload}

@app.post("/agents/{agent_name}/execute")
def execute_agent_endpoint(agent_name: str, payload: dict):
    task = execute_agent.delay(agent_name, payload)
    return {"task_id": task.id, "status": "Task dispatched to Celery"}
