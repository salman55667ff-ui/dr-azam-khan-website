from contextlib import asynccontextmanager
from secrets import compare_digest

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pydantic import BaseModel
from sqlalchemy import select

from database import Base, engine, SessionLocal
from models import Patient
from admin import ADMIN_USERNAME, ADMIN_PASSWORD_HASH
from auth import verify_password


@asynccontextmanager
async def lifespan(app: FastAPI):

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield


app = FastAPI(
    title="Dr. Azam Khan Patient Registration API",
    lifespan=lifespan
)


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# ADMIN SECURITY
# =========================

security = HTTPBasic()


def verify_admin(
    credentials: HTTPBasicCredentials = Depends(security)
):

    username_correct = compare_digest(
        credentials.username,
        ADMIN_USERNAME
    )

    password_correct = verify_password(
        credentials.password,
        ADMIN_PASSWORD_HASH
    )

    if not username_correct or not password_correct:
        raise HTTPException(
            status_code=401,
            detail="Invalid admin username or password",
            headers={"WWW-Authenticate": "Basic"}
        )

    return True


# =========================
# PATIENT SCHEMA
# =========================

class PatientCreate(BaseModel):

    patient_name: str
    guardian_name: str
    age: int
    gender: str
    phone: str
    address: str
    reason: str


# =========================
# HOME
# =========================

@app.get("/")
async def home():

    return {
        "message": "Dr. Azam Khan Backend is running!"
    }


# =========================
# ADMIN LOGIN TEST
# =========================

@app.get("/admin/login")
async def admin_login(
    admin_verified: bool = Depends(verify_admin)
):

    return {
        "message": "Admin login successful!"
    }


# =========================
# CREATE PATIENT
# =========================

@app.post("/patients")
async def create_patient(patient: PatientCreate):

    async with SessionLocal() as session:

        new_patient = Patient(
            patient_name=patient.patient_name,
            guardian_name=patient.guardian_name,
            age=patient.age,
            gender=patient.gender,
            phone=patient.phone,
            address=patient.address,
            reason=patient.reason
        )

        session.add(new_patient)

        await session.commit()

        await session.refresh(new_patient)

        return {
            "message": "Patient registered successfully!",
            "patient_id": new_patient.id
        }


# =========================
# GET ALL PATIENTS
# ADMIN ONLY
# =========================

@app.get("/patients")
async def get_patients(
    admin_verified: bool = Depends(verify_admin)
):

    async with SessionLocal() as session:

        result = await session.execute(
            select(Patient)
        )

        patients = result.scalars().all()

        return [
            {
                "id": patient.id,
                "patient_name": patient.patient_name,
                "guardian_name": patient.guardian_name,
                "age": patient.age,
                "gender": patient.gender,
                "phone": patient.phone,
                "address": patient.address,
                "reason": patient.reason
            }
            for patient in patients
        ]