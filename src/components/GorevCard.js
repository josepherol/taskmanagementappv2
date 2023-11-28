import React, { useContext } from "react";
import { MainContext } from "../hooks/MainContext";

function GorevCard({
  creator,
  title,
  project,
  priority,
  description,
  date,
  onDelete,
  onEdit,
}) {
  return (
    <div className="container ">
      <div class="card mb-5 mx-auto w-50">
        <div class="card-header">{title || "null"}</div>
        <div class="card-body">
          <h5 class="card-title">{project || "null"}</h5>
          <p class="card-text">{description || "null"}</p>
          <span class="text-muted">{date || "null"}</span>
          <div class="d-flex mt-2 justify-content-between align-items-center">
            <span class="btn btn-disable btn-sm btn-outline-primary">
              Priority: {priority || "null"}
            </span>
            @{creator || "null"}
            <div>
              <button
                class="btn btn-outline-danger btn-sm me-2"
                onClick={onDelete}
              >
                Sil
              </button>
              <button
                class="btn btn-outline-info btn-sm"
                onClick={onEdit}
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                Düzenle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GorevCard;
