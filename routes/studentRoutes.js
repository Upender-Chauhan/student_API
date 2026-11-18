const express = require("express");
const students = require("../data/students");

const router = express.Router();

// Next id never reuses a deleted id
let nextId = students.reduce((m, s) => Math.max(m, s.id), 0) + 1;

const isNonEmptyString = (v) => typeof v === "string" && v.trim() !== "";
const isValidAge = (v) => Number.isInteger(v) && v > 0 && v < 120;

// Validate body; full = all fields required (POST/PUT)
function validate(body) {
  const errors = [];
  if (!body || typeof body !== "object") return ["Request body is required"];
  if (!isNonEmptyString(body.name)) errors.push("name is required and must be a non-empty string");
  if (!isValidAge(body.age)) errors.push("age is required and must be an integer between 1 and 119");
  if (!isNonEmptyString(body.course)) errors.push("course is required and must be a non-empty string");
  if (body.email !== undefined && !(isNonEmptyString(body.email) && /^\S+@\S+\.\S+$/.test(body.email)))
    errors.push("email must be a valid email address");
  return errors;
}

// Validates :id param and finds the student
function findStudent(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ success: false, message: "Invalid student id" });
    return null;
  }
  const student = students.find((s) => s.id === id);
  if (!student) {
    res.status(404).json({ success: false, message: `Student with id ${id} not found` });
    return null;
  }
  return student;
}

// GET /students
router.get("/", (req, res) => {
  res.status(200).json({ success: true, count: students.length, data: students });
});

// GET /students/:id
router.get("/:id", (req, res) => {
  const student = findStudent(req, res);
  if (student) res.status(200).json({ success: true, data: student });
});

// POST /students
router.post("/", (req, res) => {
  const errors = validate(req.body);
  if (errors.length) return res.status(400).json({ success: false, message: "Validation failed", errors });

  const { name, age, course, email } = req.body;
  const student = { id: nextId++, name: name.trim(), age, course: course.trim() };
  if (email) student.email = email.trim();
  students.push(student);
  res.status(201).json({ success: true, message: "Student created successfully", data: student });
});

// PUT /students/:id
router.put("/:id", (req, res) => {
  const student = findStudent(req, res);
  if (!student) return;

  const errors = validate(req.body);
  if (errors.length) return res.status(400).json({ success: false, message: "Validation failed", errors });

  const { name, age, course, email } = req.body;
  student.name = name.trim();
  student.age = age;
  student.course = course.trim();
  if (email) student.email = email.trim();
  else delete student.email;
  res.status(200).json({ success: true, message: "Student updated successfully", data: student });
});

// DELETE /students/:id
router.delete("/:id", (req, res) => {
  const student = findStudent(req, res);
  if (!student) return;
  students.splice(students.indexOf(student), 1);
  res.status(200).json({ success: true, message: "Student deleted successfully", data: student });
});

module.exports = router;
