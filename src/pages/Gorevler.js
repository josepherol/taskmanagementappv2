import React, { useEffect, useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MainContext } from "../hooks/MainContext";
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
import Swal from "sweetalert2";
import GorevCard from "../components/GorevCard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Gorevler() {
  const { isAuth } = useContext(MainContext);

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Set initial loading state to true

  const navigate = useNavigate();

  const [editedTask, setEditedTask] = useState({
    project: "",
    title: "",
    date: "",
    priority: "",
    description: "",
  });

  const taskCollectionRef = collection(db, "tasks");

  useEffect(() => {
    if (!isAuth) {
      navigate("/register");
    } else {
      const getTaskData = async () => {
        try {
          const storedUserId = localStorage.getItem("uid");

          const q = query(
            taskCollectionRef,
            where("creator.id", "==", storedUserId)
          );
          const data = await getDocs(q);

          if (!data.empty) {
            // Update the state with the fetched tasks data
            setTasks(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          // Set isLoading to false when data fetching is complete
          setIsLoading(false);
        }
      };
      getTaskData();
    }
  }, []);

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

  const editTask = async (taskId) => {
    try {
      const taskData = {
        project: editedTask.project,
        title: editedTask.title,
        date: editedTask.date,
        priority: editedTask.priority,
        description: editedTask.description,
      };

      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, taskData);

      // Show a success message when the task is edited
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Task edited successfully.",
        showConfirmButton: false,
        timer: 1500, // Auto-close the alert after 1.5 seconds
      });
      const storedUserId = localStorage.getItem("uid");

      const q = query(
        taskCollectionRef,
        where("creator.id", "==", storedUserId)
      );
      const data = await getDocs(q);

      if (!data.empty) {
        // Update the state with the fetched tasks data
        setTasks(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      }
    } catch (error) {
      console.error("Error editing task: ", error);

      // Show an error SweetAlert if something goes wrong
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while editing the task.",
      });
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between">
        <p>Siz Tarafından Oluşturulan Görevler Listesi</p>
        <Link to="/alltasks">Tüm Görevleri Görüntüle</Link>
      </div>
      {isLoading ? (
        <p>Görevler Yükleniyor...</p>
      ) : tasks.length === 0 ? (
        <p>Hiç Görev Bulunamadı...</p>
      ) : (
        <div>
          {tasks.map((task) => (
            <>
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
              <div
                class="modal fade"
                id="exampleModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="exampleModalLabel">
                        {task.title} - Başlıklı Görevi Düzenleyin
                      </h1>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      <div className="mb-3">
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          value={task.project} // This value will determine the selected option
                          onChange={(event) => {
                            setEditedTask({
                              ...editedTask,
                              project: event.target.value,
                            });
                          }}
                        >
                          <option value={task.project} selected>
                            {task.project}
                          </option>
                          <option value="insaat">İnşaat</option>
                          <option value="yapi">Yapı</option>
                          <option value="malzeme">Malzeme</option>
                          <option value="sunum">Sunum</option>
                          <option value="arge">Arge</option>
                          <option value="butce">Bütçe</option>
                          <option value="onarim">Onarım</option>
                          <option value="yonetim">Yönetim</option>
                          <option value="temizleme">Temizleme</option>
                        </select>
                      </div>

                      <div class="mb-3">
                        <input
                          type="text"
                          class="form-control"
                          id="title"
                          placeholder="Başlık Girin"
                          //  value={task.title}
                          onChange={(event) => {
                            setEditedTask({
                              ...editedTask,
                              title: event.target.value,
                            });
                          }}
                        />
                      </div>

                      <div class="d-flex">
                        <p className="me-3">Bitiş Tarihi Seçiniz:</p>
                        <DatePicker
                        //      selected={task.date}
                        //      onChange={(value) => setDate(value)}
                        />
                      </div>
                      <div class="mb-3 d-flex ">
                        <select
                          class="form-select"
                          aria-label="Default select example"
                          //  value={task.priority}
                          onChange={(event) => {
                            setEditedTask({
                              ...editedTask,
                              priority: event.target.value,
                            });
                          }}
                        >
                          <option value="" selected>
                            Öncelik Sırası
                          </option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>
                      <div class="mb-3">
                        <textarea
                          class="form-control"
                          //  value={task.description}
                          id="description"
                          placeholder="Açıklama Giriniz"
                          rows="3"
                          onChange={(event) => {
                            setEditedTask({
                              ...editedTask,
                              description: event.target.value,
                            });
                          }}
                        ></textarea>
                      </div>
                      <button
                        type="button"
                        class="btn w-100 btn-success"
                        onClick={() => editTask(task.id)}
                      >
                        Kaydet
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>
      )}
    </div>
  );
}

export default Gorevler;
