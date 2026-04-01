async function loadAnalytics() {
  try {
    const range = document.getElementById("rangeSelect").value;

    const res = await fetch(
      `/api/v1/analytics/users-productivity?range=${range}`,
    );
    const data = await res.json();

    const tableBody = document.querySelector("#analyticsTable tbody");

    tableBody.innerHTML = "";

    data.data.forEach((user) => {
      const row = `
        <tr>
          <td>${user.username}</td>
          <td>${user.totalTasks}</td>
          <td>${user.completedTasks}</td>
          <td>${(user.totalTimeTaken / (1000 * 60 * 60)).toFixed(2)}</td>
          <td>${(user.completionRate * 100).toFixed(1)}%</td>
          <td>${(user.avgTime / (1000 * 60 * 60)).toFixed(2)}</td>
          <td>${user.productivityScore.toFixed(3)}</td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  } catch (err) {
    console.error("Error loading analytics:", err);
  }
}

loadAnalytics();
