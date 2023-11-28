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
          </div>
        </div>
      </div>
    </div>
  );
}

export default GorevCard;
