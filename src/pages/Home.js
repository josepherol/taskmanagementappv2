import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../hooks/MainContext";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase-config";
import { addDoc, getDocs, collection, query, where } from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";

function Home() {
  const { isAuth, setIsAuth, user, setUser, userId, setUserId } =
    useContext(MainContext);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true); // Set initial loading state to true

  const userCollectionRef = collection(db, "users");
  const taskCollectionRef = collection(db, "tasks");

  useEffect(() => {
    if (!isAuth) {
      navigate("/register");
    } else {
      const getUserData = async () => {
        try {
          const storedUserId = localStorage.getItem("uid");

          const q = query(userCollectionRef, where("id", "==", storedUserId));
          const data = await getDocs(q);

          if (!data.empty) {
            setUser(data.docs[0].data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          // Set isLoading to false when data fetching is complete
          setIsLoading(false);
        }
      };
      getUserData();
    }
  }, []);

  const [project, setProject] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState(0);
  const [description, setDescription] = useState("");

  const handleOlustur = async () => {
    try {
      const taskData = {
        creator: { id: user.id, name: user.name },
        project: project,
        title: title,
        date: date,
        priority: priority,
        description: description,
      };

      await addDoc(taskCollectionRef, taskData);

      setProject("");
      setTitle("");
      setPriority("");
      setDescription("");

      // Show a SweetAlert for success
      Swal.fire({
        icon: "success",
        title: "Başarılı!",
        text: "Görev Başarıyla Oluşturuldu.",
        showConfirmButton: false,
        timer: 1500, // Auto-close the alert after 1.5 seconds
      });
    } catch (error) {
      console.error("Error creating task: ", error);

      // Show an error SweetAlert if something goes wrong
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while creating the task.",
      });
    }
  };

  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      setUserId("");
      navigate("/register");
    });
  };

  return (
    <div>
      {isLoading ? (
        <p className="container">...Yükleniyor Lütfen Bekleyiniz...</p>
      ) : user ? (
        <div className="container">
          <div className="row">
            <h2>Hoşgeldiniz {user.name || "User"}</h2>
            {/* <button onClick={signUserOut}>Log Out</button> */}
            <div className="col-6 mt-5 mx-auto">
              <p>Yeni Bir Görev Oluşturun</p>
              <div className="mb-3">
                <select
                  class="form-select"
                  aria-label="Default select example"
                  value={project}
                  onChange={(event) => {
                    setProject(event.target.value);
                  }}
                >
                  <option value="" selected>
                    Proje Seçiniz
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
                  <option value="ithalat">İthalat</option>
                </select>
              </div>

              <div class="mb-3">
                <input
                  type="text"
                  class="form-control"
                  id="title"
                  placeholder="Görev Başlığı Girin"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                  }}
                />
              </div>
              <div class="d-flex">
                <p className="me-3">Bitiş Tarihi Seçiniz:</p>
                <DatePicker
                  selected={date}
                  onChange={(value) => setDate(value)}
                />
              </div>
              <div class="mb-3 d-flex ">
                <select
                  class="form-select"
                  aria-label="Default select example"
                  value={priority}
                  onChange={(event) => {
                    setPriority(event.target.value);
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
                  value={description}
                  id="description"
                  placeholder="Açıklama Giriniz"
                  rows="3"
                  onChange={(event) => {
                    setDescription(event.target.value);
                  }}
                ></textarea>
              </div>
              <button
                type="button"
                class="btn w-100 btn-success"
                onClick={handleOlustur}
              >
                Oluştur
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
}

export default Home;
