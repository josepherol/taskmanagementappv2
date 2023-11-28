import React, { useContext, useState, useEffect } from "react";
import { MainContext } from "../hooks/MainContext";
import { useNavigate } from "react-router-dom";
import {
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../config/firebase-config";
import GorevCard from "../components/GorevCard";
import Swal from "sweetalert2";

function Projeler() {
  const { isAuth } = useContext(MainContext);

  const [selectedTab, setSelectedTab] = useState(
    localStorage.getItem("selectedTab") || "insaat"
  );

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  const taskCollectionRef = collection(db, "tasks");

  const deleteTask = async (taskId) => {
    try {
      // Implement the logic to delete the task by taskId
      // For example, you can use the Firebase API to delete the task from Firestore.
      // After deleting, update the state to remove the deleted task from the tasks array.

      // Example:
      const taskDoc = doc(db, "tasks", taskId);
      await deleteDoc(taskDoc);
      // After deleting the post, you should update the postList state to reflect the change
      // Show a SweetAlert for success
      Swal.fire({
        icon: "success",
        title: "Başarılı!",
        text: "Görev Başarıyla Silindi.",
        showConfirmButton: false,
        timer: 1500, // Auto-close the alert after 1.5 seconds
      });
      setTasks((prevPosts) => prevPosts.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task: ", error);

      // Show an error SweetAlert if something goes wrong
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while deleting the task.",
      });
    }
  };

  useEffect(() => {
    localStorage.setItem("selectedTab", selectedTab);

    if (!isAuth) {
      navigate("/register");
    } else {
      const getTaskData = async () => {
        try {
          const q = query(
            taskCollectionRef,
            where("project", "==", selectedTab)
          );
          const data = await getDocs(q);

          if (!data.empty) {
            const tasksData = data.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
            setTasks(tasksData);
          } else {
            setTasks([]); // No tasks found
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      getTaskData();
    }
  }, [selectedTab, navigate, isAuth, taskCollectionRef]);

  return (
    <div className="container">
      <div className="d-flex flex-row justify-content-between mb-5">
        {[
          "insaat",
          "yapi",
          "malzeme",
          "sunum",
          "arge",
          "butce",
          "onarim",
          "yonetim",
          "temizleme",
          "ithalat",
        ].map((tab) => (
          <div
            key={tab}
            className={`card custom-card ${
              selectedTab === tab ? "custom-card-bg" : ""
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            <div className="card-body">
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </div>
          </div>
        ))}
      </div>
      {isLoading ? (
        <p>Görevler Yükleniyor...</p>
      ) : tasks.length === 0 ? (
        <p>Hiç Görev Bulunamadı...</p>
      ) : (
        <div>
          {tasks.map((task) => (
            <GorevCard
              key={task.id}
              creator={task.creator.name}
              title={task.title}
              project={task.project}
              priority={task.priority}
              //  date={task.date}
              description={task.description}
              onDelete={() => deleteTask(task.id)}
              // onEdit={() => editTask(task.id)}
              // Set editedTask with the current task data
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Projeler;
