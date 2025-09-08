'use client';

import { useState } from "react";
import css from "./GPACalculator.module.css"

export default function GPACalculator() {

  // --------- Arrays
  const grade_points_array = [
    { "letterGrade": "A", "point": 4.0 },
    { "letterGrade": "A-", "point": 3.7 },
    { "letterGrade": "B+", "point": 3.3 },
    { "letterGrade": "B", "point": 3.0 },
    { "letterGrade": "B-", "point": 2.7 },
    { "letterGrade": "C+", "point": 2.3 },
    { "letterGrade": "C", "point": 2.0 },
    { "letterGrade": "C-", "point": 1.7 },
    { "letterGrade": "D+", "point": 1.3 },
    { "letterGrade": "D", "point": 1.0 },
    { "letterGrade": "D-", "point": 0.7 },
    { "letterGrade": "F", "point": 0.0 },
    { "letterGrade": "S/U", "point": 0.0 },
    { "letterGrade": "S", "point": 0.0 },
    { "letterGrade": "U", "point": 0.0 },
  ]

  const semester_year_options = [
    "2010", "2011", "2012", "2013", "2014", "2015",
    "2016", "2017", "2018", "2019", "2020", "2021",
    "2022", "2023", "2024", "2025", "2026", "2027",
    "2028", "2029", "2030",
  ];


  // --------- Calculator Results
  const [calculatedGradePoints, setGradePoints] = useState(0);
  const [calculatedTakenUnits, setTakenUnits] = useState(0);
  const [calculatedGPA, setGPA] = useState(0);

  // --------- Input fields
  const [inputSemester, setInputSemester] = useState("");
  const [inputCourseName, setInputCourseName] = useState("");
  const [inputCourseGrade, setInputCourseGrade] = useState("");
  const [inputCourseUnits, setInputCourseUnits] = useState("");

  // --------- Course JSON values
  const initialCoursesJSON = {
    semesters: [
      {
        year: "",
        season: "",
        courses: [{ name: "", units: null, grade: "" }],
      },
    ],
  };

  const [coursesJSONFile, setCoursesJSONFile] = useState<File | null>(null);
  const [coursesJSONURL, setCoursesJSONURL] = useState("");
  const [coursesJSON, setCoursesJSON] = useState(initialCoursesJSON);

  // --------- Status variables  // -1: bad, 1: good
  const [JSONFileOpenStatus, setJSONFileOpenStatus] = useState(0)
  const [downloadStatus, setDownloadStatus] = useState(0)

  // --------- Double-check flags
  const [doubleCheckDeleteCourse, setDoubleCheckDeleteCourse] = useState(false);
  const [doubleCheckDeleteSemester, setDoubleCheckDeleteSemester] = useState(false);
  const [doubleCheckClearSchedule, setDoubleCheckClearSchedule] = useState(false);

  // --------- Download & Load course functions

  function downloadCoursesJSON() {
    try {
      const jsonString = JSON.stringify(coursesJSON, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "courses.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);

      console.log("JSON file of courses downloaded.");
      setDownloadStatus(1);
    } catch (error) {
      console.log("JSON file of courses failed to download: ", error);
      setDownloadStatus(-1);
    }
    removeStatus(setDownloadStatus);
  }

  function loadCoursesJSONfile(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    setCoursesJSONFile(file);
    const url = URL.createObjectURL(file);
    setCoursesJSONURL(url);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = String(e.target?.result ?? "");
        const jsonContent = JSON.parse(text);
        setCoursesJSON(jsonContent);
        console.log("JSON courses file loaded.");
        setJSONFileOpenStatus(1); // good
      } catch (parseError: any) {
        console.error("Error parsing JSON:", parseError?.message ?? parseError);
        setJSONFileOpenStatus(-1); // bad
      } finally {
        removeStatus(setJSONFileOpenStatus);
      }
    };
    reader.readAsText(file);
  }

  function removeStatus(
    setter: React.Dispatch<React.SetStateAction<number>>
  ) {
    setTimeout(() => {
      setter(0);
    }, 3000);
  }

  // --------- CRUD calculator functions
  function createSemester() {
    try {
      setCoursesJSON(prev => ({
        ...prev,
        semesters: [
          ...prev.semesters,
          {
            year: "",
            season: "",
            courses: [{ name: "", units: null, grade: "" }],
          }
        ]
      }))
      console.log("Semester created");
    } catch (error) {
      console.log("Semester failed to be made: ", error);
    }
  }

  function deleteSemester(semesterIndex: number): void {
    setCoursesJSON(prev => ({
      ...prev,
      semesters: prev.semesters.filter((_, i) => i !== semesterIndex),
    }));
    console.log("Semester deleted.");
  }

  function createCourse(semesterIndex: number): void {
    setCoursesJSON(prev => ({
      ...prev,
      semesters: prev.semesters.map((s, i) =>
        i === semesterIndex
          ? { ...s, courses: [...s.courses, { name: "", units: null, grade: "" }] }
          : s
      ),
    }));
    console.log("Course created");
  }

  function deleteCourse(semesterIndex: number, courseIndex: number): void {
    setCoursesJSON(prev => ({
      ...prev,
      semesters: prev.semesters.map((s, i) =>
        i === semesterIndex
          ? { ...s, courses: s.courses.filter((_, j) => j !== courseIndex) }
          : s
      ),
    }));
    console.log("Course deleted");
  }

  function clearSchedule() {
    setCoursesJSON({
      semesters: [
        { year: "", season: "", courses: [{ name: "", units: null, grade: "" }] },
      ],
    })
    console.log("Course schedule has been cleared")
  }

// className={css[""]}

  return (
    <div className={css["container"]}>
      <div className={css["results-container"]}>
        <div className={css["results-bg"]}>
          <p className={css["result-label"]}>Grade Points</p>
          <p className={css["result"]}>{calculatedGradePoints}</p>
        </div>
        <div className={css["space"]}></div>
        <div className={css["results-bg"]}>
          <p className={css["result-label"]}>GPA</p>
          <p className={css["result"]}>{calculatedGPA}</p>
        </div>
        <div className={css["space"]}></div>
        <div className={css["results-bg"]}>
          <p className={css["result-label"]}>Units Taken</p>
          <p className={css["result"]}>{calculatedTakenUnits}</p>
        </div>
      </div>
      <div>
        
      </div>
    </div>
  )
}