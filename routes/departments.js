module.exports = function (server) {
  const { readLastUsedDeparmtentId } = require("../utils");

  let departmentIdCounter = readLastUsedDeparmtentId();

  const jsonServer = require("json-server");

  const router = jsonServer.router("db.json");

  // Endpoint for creating new department and updating an existing department
  server.post("/api/departments", (request, response) => {
    const requestBody = request.body;

    if (requestBody.name === undefined) {
      return response
        .status(430)
        .json({ message: "Name of department must be provided!" });
    }
    if (requestBody.id === undefined) {
      let departmentId = departmentIdCounter++;
      const newDepartment = {
        id: departmentId,
        name: requestBody.name,
        employee_list: [],
      };
      const departmentsData = router.db.get("departments").value();
      departmentsData.push(newDepartment);

      router.db.set("departments", departmentsData).write();

      const lastUsedId = router.db.get("lastUsedId").value();
      lastUsedId.departmentId = departmentIdCounter;
      router.db.set("lastUsedId", lastUsedId).write();

      response.status(201).json(newDepartment);
    } else {
      const departmentsData = router.db.get("departments").value();
      const departmentId = parseInt(requestBody.id, 10);
      const index = departmentsData.findIndex(
        (dept) => dept.id === departmentId
      );

      if (index === -1) {
        response.status(404).json({ error: "Department nout found" });
      } else {
        departmentsData[index] = {
          ...departmentsData[index],
          ...requestBody,
        };
        router.db.set("departments", departmentsData).write();
        response.json(departmentsData[index]);
      }
    }
  });
  // Endoopoint- fetch All departments

  server.get("/api/departments/all", (request, response) => {
    const departmentsData = router.db.get("departments").value();
    response.json(departmentsData);
  });

  //endpoint = fetch department by id

  server.get("/api/department/:id", (req, res) => {
    const departmentId = parseInt(req.params.id);
    const departmentsData = router.db.get("departments").value();

    const department = departmentsData.find(
      (department) => department.id === departmentId
    );

    if (!department) {
      res.status(404).json({ error: "department not found" });
    } else {
      res.status(200).json(department);
    }
  });

  //endpoint - delete deparment by id

  server.delete("/api/department/delete/:id", (request, response) => {
    const departmentId = parseInt(request.params.id);
    const departmentsData = router.db.get("departments").value();

    const departmentIndex = departmentsData.findIndex(
      (dept) => dept.id === departmentId
    );

    if (departmentIndex === -1) {
      return response.status(400).json({ error: "Department not found" });
    }
    const department = departmentsData[departmentIndex];

    if (department.employee_list.length > 0) {
      return response
        .status(400)
        .json({ error: "Cannot delete department with employees!" });
    }

    const updatedDepartments = departmentsData.filter(
      (dept) => dept.id !== departmentId
    );

    router.db.set("departments", updatedDepartments).write();

    response.json({ message: "Department deleted successfully" });
  });
};
