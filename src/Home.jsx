import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useSearchParams } from "react-router-dom";
import styles from "./home.module.css";
import { useEffect, useState } from "react";
import { Popconfirm } from "antd";
import {
  arrayUnion,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  or,
  orderBy,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase.config";

const Home = () => {
  const [loader, setLoader] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams({
    date: new Date().toISOString(),
  });

  const [slot, setSlot] = useState(null);
  const [sessions, setSessions] = useState([]);

  async function getSessions() {
    const sessionsRef = doc(
      db,
      "sessions",
      searchParams.get("date").split("T")[0]
    );

    try {
      const collections = await getDoc(sessionsRef);
      setSessions(collections.data()?.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  const timeSlots = [
    {
      index: 0,
      startAt: "10.00",
      endsAt: "10.45",
    },
    {
      index: 1,
      startAt: "10.45",
      endsAt: "11.30",
    },
    {
      index: 2,
      startAt: "11.30",
      endsAt: "12.15",
    },
    {
      index: 3,
      startAt: "12.15",
      endsAt: "01.00",
    },
    {
      index: 4,
      startAt: "02.00",
      endsAt: "02.45",
    },
    {
      index: 5,
      startAt: "02.45",
      endsAt: "03.30",
    },
    {
      index: 6,
      startAt: "03.30",
      endsAt: "04.15",
    },
    {
      index: 7,
      startAt: "04.15",
      endsAt: "05.00",
    },
  ];

  function handleChange(value) {
    setSearchParams((prev) => {
      prev.set("date", value.toISOString());
      return prev;
    });
  }

  async function handleConfirm() {
    setLoader(true);
    const sessionsRef = doc(
      db,
      "sessions",
      searchParams.get("date").split("T")[0]
    );
    try {
      if (sessions?.length) {
        await updateDoc(sessionsRef, {
          data: arrayUnion({ isSessionBooked: true, index: slot }),
        });
      } else {
        await setDoc(sessionsRef, {
          data: [{ isSessionBooked: true, index: slot }],
        });
      }
      await getSessions();
    } catch (error) {
      console.log(error.message);
    }
    setLoader(false);
  }

  const updatedTimeSlots = timeSlots.map((slot) => {
    const bookedSession = sessions?.find(
      (session) => session?.index === slot?.index
    );

    if (bookedSession) {
      return { ...slot, ...bookedSession };
    }

    return slot;
  });

  useEffect(() => {
    getSessions();
  }, [searchParams.get("date")]);

  return (
    <>
      <div className={[`${styles.container} cal-container`]}>
        <Calendar onChange={handleChange} />
        <div className={[`${styles.daylyHours}`]}>
          {updatedTimeSlots?.map((ele, i) => (
            <Popconfirm
              key={i}
              title="Book an appointment"
              description={`Do you want to book an appointment for ${timeSlots[slot]?.startAt} to ${timeSlots[slot]?.endsAt}?`}
              okText="Yes"
              icon={null}
              cancelText="No"
              onConfirm={handleConfirm}
            >
              <div
                className={`${styles.daylyHoursBlock} ${
                  ele.isSessionBooked ? styles.active : null
                }`}
                onClick={() => setSlot(i)}
              >
                {ele.startAt} to {ele.endsAt}
              </div>
            </Popconfirm>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
