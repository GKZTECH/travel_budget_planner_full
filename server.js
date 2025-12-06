 const DATA_URL = 'https://raw.githubusercontent.com/username/repo/main/data.json';

    fetch(DATA_URL)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        document.getElementById('jsonData').textContent = JSON.stringify(data, null, 2);
      })
      .catch(error => {
        document.getElementById('jsonData').textContent = 'Error loading data: ' + error;
      });