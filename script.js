// Function to perform search based on selected column
// Function to perform search based on selected column
function search() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const selectedColumn = document.getElementById('search-column').value; // Store currently selected value
    const resultsContainer = document.getElementById('search-results');
    const resultCountBtn = document.getElementById('result-count-btn'); // Get the result count button element
    const searchBox = document.getElementById('search-box');
    const table = document.createElement('table');
    resultsContainer.innerHTML = ''; // Clear previous results
    try {
        fetch('FILE_NAME.csv')
            .then(response => response.text())
            .then(csvData => {
                const parsedData = Papa.parse(csvData, { header: true });
                const headers = parsedData.meta.fields; // Extract headers
                const results = parsedData.data
                                    .filter(row => {
                                        if (selectedColumn === 'all') {
                                            return Object.values(row).some(cell => cell && cell.toString().toLowerCase().includes(searchTerm));
                                        } else {
                                            return row[selectedColumn] && row[selectedColumn].toString().toLowerCase().includes(searchTerm);
                                        }
                                    });
                if (results.length === 0 && searchTerm !== '') { // Check if search term is not empty
                    const errorMessage = document.createElement('p');
                    errorMessage.textContent = 'No results found.';
                    resultsContainer.appendChild(errorMessage);
                    
                    resultCountBtn.textContent = 'Total Results: 0'; // Update result count button text
                    resultCountBtn.classList.remove('hide'); // Show result count button

                    searchBox.classList.remove('hide');
                    resultsContainer.classList.remove('hide');
                    return;
                }
                const headerRow = document.createElement('tr');
                headers.forEach(headerText => { // Use dynamically generated headers
                    const th = document.createElement('th');
                    th.textContent = headerText;
                    headerRow.appendChild(th);
                });
                table.appendChild(headerRow);
                results.forEach(rowData => {
                    const rowElement = document.createElement('tr');
                    headers.forEach(header => { // Use dynamically generated headers
                        const cellElement = document.createElement('td');
                        cellElement.textContent = rowData[header];
                        rowElement.appendChild(cellElement);
                    });
                    table.appendChild(rowElement);
                });
                resultsContainer.appendChild(table);
                
                resultCountBtn.textContent = `Total Results: ${results.length}`; // Update result count button text
                resultCountBtn.classList.remove('hide'); // Show result count button

                searchBox.classList.remove('hide');
                resultsContainer.classList.remove('hide');
                generateDropdownOptions(headers, selectedColumn); // Update dropdown options and pass currently selected value
            });
    } catch (error) {
        console.error('Error reading CSV file:', error);
    }
}

// Function to dynamically generate dropdown options based on CSV headers
function generateDropdownOptions(headers, selectedValue) {
    const dropdown = document.getElementById('search-column');
    const previousSelectedValue = dropdown.value; // Store previous selected value
    dropdown.innerHTML = ''; // Clear previous options
    const optionAll = document.createElement('option');
    optionAll.value = 'all';
    optionAll.textContent = 'Search All';
    dropdown.appendChild(optionAll);
    headers.forEach(header => {
        const option = document.createElement('option');
        option.value = header;
        option.textContent = header;
        dropdown.appendChild(option);
    });
    dropdown.value = selectedValue || previousSelectedValue; // Restore previous selected value or keep it unchanged
}


        // Attach event listeners for search input and button
        document.getElementById('search-input').addEventListener('input', search);
        document.getElementById('search-button').addEventListener('click', search);

        // Initial search to display results and populate dropdown options
        search();
