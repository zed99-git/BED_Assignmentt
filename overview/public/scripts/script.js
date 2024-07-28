document.getElementById('showAllBtn').addEventListener('click', async () => {
  try {
      const response = await fetch('http://localhost:3000/data');
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      displayData(data);
  } catch (error) {
      console.error('Error fetching data:', error);
  }
});

document.getElementById('addDataBtn').addEventListener('click', () => {
  document.getElementById('formContainer').style.display = 'block';
  document.getElementById('dataForm').onsubmit = async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData.entries());
      try {
          const response = await fetch('http://localhost:3000/data', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
          });
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          alert('Data added successfully');
          event.target.reset();
          document.getElementById('formContainer').style.display = 'none';
      } catch (error) {
          console.error('Error adding data:', error);
      }
  };
});

document.getElementById('deleteDataBtn').addEventListener('click', () => {
  document.getElementById('deleteContainer').style.display = 'block';
  document.getElementById('deleteForm').onsubmit = async (event) => {
      event.preventDefault();
      const weekly = document.getElementById('deleteWeekly').value;
      try {
          const response = await fetch(`http://localhost:3000/data/${weekly}`, {
              method: 'DELETE',
          });
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          alert('Data deleted successfully');
          event.target.reset();
          document.getElementById('deleteContainer').style.display = 'none';
      } catch (error) {
          console.error('Error deleting data:', error);
      }
  };
});

document.getElementById('updateDataBtn').addEventListener('click', () => {
  document.getElementById('updateContainer').style.display = 'block';
  document.getElementById('updateForm').onsubmit = async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData.entries());
      const weekly = data.weekly;
      delete data.weekly;
      try {
          const response = await fetch(`http://localhost:3000/data/${weekly}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
          });
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          alert('Data updated successfully');
          event.target.reset();
          document.getElementById('updateContainer').style.display = 'none';
      } catch (error) {
          console.error('Error updating data:', error);
      }
  };
});

function displayData(data) {
  const dataContainer = document.getElementById('dataContainer');
  dataContainer.innerHTML = '';

  if (data.length === 0) {
      dataContainer.innerHTML = '<p>No data available.</p>';
      return;
  }

  const table = document.createElement('table');
  const headerRow = document.createElement('tr');

  const headers = Object.keys(data[0]);
  headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
  });

  table.appendChild(headerRow);

  data.forEach(item => {
      const row = document.createElement('tr');
      headers.forEach(header => {
          const cell = document.createElement('td');
          cell.textContent = item[header];
          row.appendChild(cell);
      });
      table.appendChild(row);
  });

  dataContainer.appendChild(table);
}



//search function

async function fetchData() {
  document.getElementById("searchForm").addEventListener("submit", async function(event) {
      event.preventDefault();

      const week = document.getElementById("week").value;
      const resultsDiv = document.getElementById("results");
      console.log(`Submitting search for week: ${week}`);

      try {
          const response = await fetch(`http://localhost:3000/data/search?week=${week}`);
          console.log(`Response status: ${response.status}`);
          if (!response.ok) {
              throw new Error("Data not found or error retrieving data");
          }
          const data = await response.json();

          resultsDiv.innerHTML = `<h2>Results for Week ${week}</h2><pre>${JSON.stringify(data, null, 2)}</pre>`;
      } catch (error) {
          resultsDiv.innerHTML = `<p>${error.message}</p>`;
          console.error("Error:", error);
      }
  });
}
document.addEventListener("DOMContentLoaded", fetchData);
