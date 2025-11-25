'use client';

import css from "./calculator.module.css"
import { useState, useRef } from "react";

export default function Calculator() {
  const [calcMode, setCalcMode] = useState(true);

  return (
    <div>
      <div className={css["mode-selection-container"]}>
        <button onClick={() => setCalcMode(true)} className={`${css["mode-btn"]} ${calcMode ? css["active-mode"] : ''}`}>GPA</button>
        <button onClick={() => setCalcMode(false)} className={`${css["mode-btn"]} ${!calcMode ? css["active-mode"] : ''}`}>Exams</button>
      </div>
      {calcMode ? <GPACalculator /> : <ExamsCalculator />}
    </div>
  );
}


/* Exam Calculator
 ******************************/

function ExamsCalculator() {
  const [currentGrade, setCurrentGrade] = useState('');
  const [desiredGrade, setDesiredGrade] = useState('');
  const [examWeight, setExamWeight] = useState('');
  const [examMaxPoints, setExamMaxPoints] = useState('');

  // Calculation
  const calculateNeeded = () => {
    const current = parseFloat(currentGrade);
    const desired = parseFloat(desiredGrade);
    const weight = parseFloat(examWeight) / 100;

    if (!current || !desired || !weight) return null;

    const needed = (desired - (current * (1 - weight))) / weight;
    return needed.toFixed(2);
  };

  const neededPercent = calculateNeeded();

  return (
    <div className={css["calc-container"]}>
      <p className={css["page-title"]}>Calculate What&apos;s Needed On Your Exam</p>

      <div className={css["input"]}>
        <label>Current Grade (%)</label>
        <input
          type="number"
          value={currentGrade}
          onChange={(e) => setCurrentGrade(e.target.value)}
          placeholder="85"
        />
      </div>

      <div className={css["input"]}>
        <label>Desired Final Grade (%)</label>
        <input
          type="number"
          value={desiredGrade}
          onChange={(e) => setDesiredGrade(e.target.value)}
          placeholder="90"
        />
      </div>

      <div className={css["input"]}>
        <label>Exam Weight (%)</label>
        <input
          type="number"
          value={examWeight}
          onChange={(e) => setExamWeight(e.target.value)}
          placeholder="30"
        />
      </div>

      <div className={css["input"]}>
        <label>Max Points Possible</label>
        <input
          type="number"
          value={examMaxPoints}
          onChange={(e) => setExamMaxPoints(e.target.value)}
          placeholder="25"
        />
      </div>

      {neededPercent && (
        <div className={css["result"]}>
          <p>
            You need <strong>{neededPercent}%</strong> on the exam
            {examMaxPoints && ` (${((parseFloat(neededPercent) / 100) * parseFloat(examMaxPoints)).toFixed(1)}/${examMaxPoints})`}
          </p>
        </div>
      )}
    </div>
  );
}

/* GPA Calculator
 ******************************/

function GPACalculator() {

  const [courses, setCourses] = useState([
    { id: 1, name: '', credits: 3, grade: 'A' }
  ]);

  const gradePoints = {
    'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0
  };

  // Calculation
  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
      if (course.grade && course.credits) {
        totalPoints += gradePoints[course.grade as keyof typeof gradePoints] * course.credits;
        totalCredits += course.credits;
      }
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(3) : '0.000';
  };

  // Manage courses
  const addCourse = () => {
    setCourses([...courses, {
      id: Date.now(),
      name: '',
      credits: 3,
      grade: 'A'
    }]);
  };
  const deleteCourse = (id: number) => {
    setCourses(courses.filter(c => c.id !== id));
  };
  const updateCourse = (id: number, field: 'name' | 'credits' | 'grade', value: string | number) => {
    setCourses(courses.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  // File download & upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const downloadJSON = () => {
    const dataStr = JSON.stringify(courses, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gpa-courses-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Upload/Load JSON file
  const uploadJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const loadedCourses = JSON.parse(e.target?.result as string);
        setCourses(loadedCourses);
      } catch (error) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className={css["calc-container"]}>
      <p className={css["page-title"]}>Calculate your GPA</p>

      <div className={css["courses-list"]}>
        <div className={css["gpa-display"]}>
          <p>Your GPA: <strong>{calculateGPA()}</strong></p>
        </div>
        <button onClick={addCourse} className={css["add-btn"]}>
          + Add Course
        </button>
        <div className={css["json-controls"]}>
          <button onClick={downloadJSON} className={css["download-btn"]}>
            💾 Save Courses (JSON)
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={uploadJSON}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className={css["upload-btn"]}
          >
            📂 Load Courses (JSON)
          </button>
        </div>
        {courses.map((course) => (
          <div key={course.id} className={css["course-row"]}>
            <input
              type="text"
              placeholder="Course name"
              value={course.name}
              onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
            />
            <input
              type="number"
              placeholder="Credits"
              value={course.credits}
              onChange={(e) => updateCourse(course.id, 'credits', parseFloat(e.target.value))}
            />
            <select className={css["select"]}
              value={course.grade}
              onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
            >
              {Object.keys(gradePoints).map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
            <button className={css["delete-btn"]} onClick={() => deleteCourse(course.id)}>Delete</button>
          </div>
        ))}
      </div>

    </div>
  );
}