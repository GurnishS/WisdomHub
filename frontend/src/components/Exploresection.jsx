import List from "./List";
import { useState, useEffect } from "react";
import config from "./../config";

export default function Exploresection({ setCurrentPage }) {
  const fetchUrl = config.apiUrl + "files/";
  const [books, setBooks] = useState([]);
  const [questionPapers, setQuestionPapers] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(fetchUrl + "get-books", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          store.addMessage({
            type: "Danger",
            content: "Network response was not ok",
          });
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setBooks(data.data.slice(0, 4));
      } catch (error) {
        store.addMessage({ type: "Danger", content: error.message });
      }
    };

    fetchData();
  }, []); // useEffect dependency updated to fetchUrl

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(fetchUrl + "get-question-papers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setQuestionPapers(data.data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(fetchUrl + "get-study-materials", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setStudyMaterials(data.data.slice(0, 4)); // Assuming data is an array of items
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // useEffect dependency updated to fetchUrl

  return (
    <>
      <List
        heading="Question Papers"
        items={questionPapers}
        setCurrentPage={setCurrentPage}
      />
      <List heading="Books" items={books} setCurrentPage={setCurrentPage} />
      <List
        heading="Study Materials"
        items={studyMaterials}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}
