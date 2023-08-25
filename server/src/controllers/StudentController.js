const Student = require("./../models/StudentModel");

const createStudent = async (req, res) => {
  const {
    school_id,
    first_name,
    middle_name,
    last_name,
    suffix = "N/A",
    gender,
    birthdate,
    contact_number = "N/A",
    parent,
    address,
  } = req.body;

  const errorFields = [];
  const errorMessage = "Please fill in all fields";
  if (!school_id) errorFields.push("school_id");
  if (!first_name) errorFields.push("first_name");
  if (!last_name) errorFields.push("last_name");
  if (!gender) errorFields.push("gender");
  if (!birthdate) errorFields.push("birthdate");
  if (!parent) errorFields.push("parent");
  if (!address) errorFields.push("address");
  if (errorFields.length > 0) {
    return res.status(400).json({ error: errorMessage, errorFields });
  }

  const newStudent = {
    school_id,
    first_name,
    middle_name,
    last_name,
    suffix,
    gender,
    birthdate,
    contact_number,
    parent,
    address,
  };

  try {
    const student = await Student.create(newStudent);
    return res.status(200).json(student);
  } catch (error) {
    return res.status(400).json({ error });
  }
};

module.exports = {
  createStudent,
};
