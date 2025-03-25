module.exports = function (server) {
  const { readLastUsedEmployeeId } = require("../utils");
  const jsonServer = require("json-server");
  const router = jsonServer.router("db.json");
  let employeeIdCounter = readLastUsedEmployeeId();

  // Endopoint create new employee

  server.post("/api/employee/:id", (request, response) => {
    const departmentId = parseInt(request.params.id);
    const requestBody = request.body;
    const departmentsData = router.db.get("departments").value();
    const index = departmentsData.findIndex((dept) => dept.id === departmentId);

    if (index === -1) {
      return response.status(404).json({ error: "Department not found" });
    } else {
      const department = departmentsData[index];
      const employeeList = department.employee_list;
      // If id of employee is undefined  - create employee
      if (requestBody.id === undefined) {
        let employeeId;
        employeeId = ++employeeIdCounter;

        const newEmployee = {
          id: employeeId,
          name: requestBody.name,
          address: requestBody.address,
          email: requestBody.email,
          phone: requestBody.phone,
        };
        employeeList.push(newEmployee);

        department.employee_list = employeeList;

        router.db.set("departments", departmentsData).write();

        const lastUsedId = router.db.get("lastUsedId").value();
        lastUsedId.employeeId = employeeIdCounter;
        router.db.set("lastUsedId", lastUsedId).write();
        response.json(departmentsData[index]);
      } else {
        return response.status(400).json({
          error:
            "Employee ID should not be provided for creation. The server will assign an ID automatically.",
        });
      }
    }
  });
};
