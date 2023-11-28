import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  let selectedTab = "";
  switch (location.pathname) {
    case "/":
      selectedTab = "home";
      break;
    case "/projects":
      selectedTab = "projects";
      break;
    case "/tasks":
      selectedTab = "tasks";
      break;
    case "/alltasks":
      selectedTab = "tasks";
      break;
    default:
      selectedTab = "";
      break;
  }
  return (
    <div class="container">
      <header class="d-flex justify-content-center py-3">
        <ul class="nav nav-pills">
          <li class="nav-item">
            <Link
              to="/"
              class={`nav-link ${selectedTab === "home" ? "active" : ""}`}
            >
              Anasayfa
            </Link>
          </li>
          <li class="nav-item">
            <Link
              to="/projects"
              class={`nav-link ${selectedTab === "projects" ? "active" : ""}`}
            >
              Projeler
            </Link>
          </li>
          <li class="nav-item">
            <Link
              to="/tasks"
              class={`nav-link ${selectedTab === "tasks" ? "active" : ""}`}
            >
              Görevler
            </Link>
          </li>
        </ul>
      </header>
    </div>
  );
}
