from sqlalchemy import String, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Patient(Base):
    __tablename__ = "patients"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    patient_name: Mapped[str] = mapped_column(
        String(100)
    )

    guardian_name: Mapped[str] = mapped_column(
        String(100)
    )

    age: Mapped[int] = mapped_column(
        Integer
    )

    gender: Mapped[str] = mapped_column(
        String(20)
    )

    phone: Mapped[str] = mapped_column(
        String(20)
    )

    address: Mapped[str] = mapped_column(
        String(255)
    )

    reason: Mapped[str] = mapped_column(
        Text
    )