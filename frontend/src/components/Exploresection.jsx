import List from "./List";
import { useState, useEffect } from "react";
import { SimpleApiHandler } from "../utils/ApiHandler.js";
export default function Exploresection({ setCurrentPage }) {
  const [books, setBooks] = useState([]);
  const [questionPapers, setQuestionPapers] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  useEffect(() => {
    SimpleApiHandler("files/get-books", "GET", {}, false).then((data) => {
      setBooks(data.data.slice(0, 4));
    });
  }, []);

  useEffect(() => {
    SimpleApiHandler("files/get-question-papers", "GET", {}, false).then(
      (data) => {
        setQuestionPapers(data.data.slice(0, 4));
      }
    );
  }, []);

  useEffect(() => {
    SimpleApiHandler("files/get-study-materials", "GET", {}, false).then(
      (data) => {
        setStudyMaterials(data.data.slice(0, 4));
      }
    );
  }, []);

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
