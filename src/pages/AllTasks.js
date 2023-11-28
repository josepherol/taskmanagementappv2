import React, { useState, useEffect, useContext } from "react";
import { MainContext } from "../hooks/MainContext";
import { auth, db } from "../config/firebase-config";
import { useNavigate, Link } from "react-router-dom";
import GorevCardAll from "../components/GorevCardAll";
import {
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";

function AllTasks() {
  const navigate = useNavigate();
  const { isAuth } = useContext(MainContext);

  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    if (!isAuth) {
      navigate("/register");
    } else {
      const getTaskData = async () => {
        try {
          const q = query(
            collection(db, "tasks"),
            orderBy("priority", "desc"), // Order by a field, replace "date" with the actual field name
            limit(itemsPerPage)
          );
          const data = await getDocs(q);
          console.log("data: ", data);
          if (!data.empty) {
            // Update the state with the fetched tasks data
            const taskData = data.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
            setTasks(taskData);
            setLastVisible(data.docs[data.docs.length - 1]);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      getTaskData();
    }
  }, [isAuth]);

  const loadMore = async () => {
    if (lastVisible) {
      const q = query(
        collection(db, "tasks"),
        orderBy("date"), // Order by the same field as the initial query
        startAfter(lastVisible),
        limit(itemsPerPage)
      );
      const data = await getDocs(q);
      console.log("datas: ", data);

      if (!data.empty) {
        const moreTasks = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setTasks([...tasks, ...moreTasks]);
        setLastVisible(data.docs[data.docs.length - 1]);
      }
    }
  };

  return (
    <div className="container">
      <p>Tüm Görevler</p>
      {isLoading ? (
        <p>Görevler Yükleniyor...</p>
      ) : tasks.length === 0 ? (
        <p>Hiç Görev Bulunamadı...</p>
      ) : (
        <div>
          {tasks.map((task) => (
            <GorevCardAll
              key={task.id}
              creator={task.creator.name}
              title={task.title}
              project={task.project}
              priority={task.priority}
              description={task.description}
            />
          ))}
          {tasks.length % itemsPerPage === 0 ? (
            <button onClick={loadMore}>Load More</button>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default AllTasks;
