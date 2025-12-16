async function loadUsers() {
  const tbody = document.getElementById("usersTableBody");
  tbody.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";

  try {
    const data = await adminApiGet("/users");

    console.log("USERS API RESPONSE:", data);

    const users = Array.isArray(data)
      ? data
      : data.users || [];

    tbody.innerHTML = "";

    if (users.length === 0) {
      tbody.innerHTML =
        "<tr><td colspan='5'>No users found</td></tr>";
      return;
    }

    users.forEach(u => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${u.name || "-"}</td>
        <td>${u.email || "-"}</td>
        <td>${u.status || "ACTIVE"}</td>
        <td>${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</td>
        <td>-</td>
      `;

      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error(err);
    tbody.innerHTML =
      "<tr><td colspan='5'>Failed to load users</td></tr>";
  }
}
