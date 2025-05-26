import List from "./List";
import { useState, useEffect } from "react";
import { SimpleApiHandler } from "../utils/ApiHandler.js";
export default function Exploresection() {
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
        link="/question-papers"
        items={questionPapers}
      />
      <List
        heading="Books"
        link="/books"
        items={books} />
      <List
        heading="Study Materials"
        link="/study-materials"
        items={studyMaterials}
      />
    </>
  );
}
