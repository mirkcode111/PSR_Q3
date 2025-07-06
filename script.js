// Global variables
let allData = [];
let filteredData = [];
let pieCharts = {};
const pieChartQuarters = ['Q3_FY24', 'Q4_FY24', 'Q1_FY25', 'Q2_FY25', 'Q3_FY25'];
const summaryQuarterSelect = document.getElementById('summaryQuarterSelect');
const summaryQuarterLabel = document.getElementById('summaryQuarterLabel');

// DOM elements
const transactionTypeSelect = document.getElementById('transactionType');
const subTypeSelect = document.getElementById('subType');
const metricTypeSelect = document.getElementById('metricType');
const resetFiltersBtn = document.getElementById('resetFilters');
const searchInput = document.getElementById('searchInput');
const tableFilterSelect = document.getElementById('tableFilter');
const tableBody = document.getElementById('tableBody');

// Summary elements
const totalVolumeEl = document.getElementById('totalVolume');
const totalValueEl = document.getElementById('totalValue');
const transactionTypesCountEl = document.getElementById('transactionTypesCount');
const subTypesCountEl = document.getElementById('subTypesCount');

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupEventListeners();
    setTimeout(createPieCharts, 0); // Ensure DOM is ready
});

// Load CSV data
async function loadData() {
    try {
        const response = await fetch('data.csv');
        const csvText = await response.text();
        // Use PapaParse to parse the CSV
        const parsed = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: false, // Always treat as string
            transform: value => typeof value === 'string' ? value.trim().replace(/^"|"$/g, '') : value,
            transformHeader: header => header.trim().replace(/^"|"$/g, '')
        });
        allData = parsed.data;
        filteredData = [...allData];
        
        // Debug: log a few rows to check for commas
        console.log('Parsed Data Example:', parsed.data.slice(0, 5));
        
        populateFilters();
        updateSummary();
        updateTable();
        createChart();
        updatePieCharts();
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading data. Please make sure data.csv is in the same directory.');
    }
}

// Setup event listeners
function setupEventListeners() {
    resetFiltersBtn.addEventListener('click', resetFilters);
    searchInput.addEventListener('input', handleSearch);
    tableFilterSelect.addEventListener('change', updateTable);
    
    // Update sub-types when transaction type changes
    transactionTypeSelect.addEventListener('change', () => {
        updateSubTypeOptions();
        applyFilters();
        updatePieCharts();
    });
    subTypeSelect.addEventListener('change', () => {
        applyFilters();
        updatePieCharts();
    });
    metricTypeSelect.addEventListener('change', () => {
        applyFilters();
        updatePieCharts();
    });
    summaryQuarterSelect.addEventListener('change', () => {
        updateSummary();
        summaryQuarterLabel.textContent = summaryQuarterSelect.options[summaryQuarterSelect.selectedIndex].text;
    });
}

// Populate filter dropdowns
function populateFilters() {
    const transactionTypes = [...new Set(allData.map(row => row['Transaction Type']))];
    const subTypes = [...new Set(allData.map(row => row['Sub_type']))];
    
    // Populate transaction types
    transactionTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        transactionTypeSelect.appendChild(option);
    });
    
    // Populate sub types
    subTypes.forEach(subType => {
        const option = document.createElement('option');
        option.value = subType;
        option.textContent = subType;
        subTypeSelect.appendChild(option);
    });
}

// Update sub-type options based on selected transaction type
function updateSubTypeOptions() {
    const selectedTransactionType = transactionTypeSelect.value;
    
    // Clear current options
    subTypeSelect.innerHTML = '<option value="all">All Sub Types</option>';
    
    if (selectedTransactionType === 'all') {
        // Show all sub types
        const allSubTypes = [...new Set(allData.map(row => row['Sub_type']))];
        allSubTypes.forEach(subType => {
            const option = document.createElement('option');
            option.value = subType;
            option.textContent = subType;
            subTypeSelect.appendChild(option);
        });
    } else {
        // Show only sub types for selected transaction type
        const filteredSubTypes = [...new Set(
            allData
                .filter(row => row['Transaction Type'] === selectedTransactionType)
                .map(row => row['Sub_type'])
        )];
        
        filteredSubTypes.forEach(subType => {
            const option = document.createElement('option');
            option.value = subType;
            option.textContent = subType;
            subTypeSelect.appendChild(option);
        });
    }
}

// Apply filters
function applyFilters() {
    const selectedTransactionType = transactionTypeSelect.value;
    const selectedSubType = subTypeSelect.value;
    
    filteredData = allData.filter(row => {
        const transactionTypeMatch = selectedTransactionType === 'all' || 
                                   row['Transaction Type'] === selectedTransactionType;
        const subTypeMatch = selectedSubType === 'all' || 
                           row['Sub_type'] === selectedSubType;
        
        return transactionTypeMatch && subTypeMatch;
    });
    
    updateSummary();
    updateTable();
    updateChart();
    updatePieCharts();
}

// Reset filters
function resetFilters() {
    transactionTypeSelect.value = 'all';
    subTypeSelect.value = 'all';
    metricTypeSelect.value = 'volume';
    // Only include rows with valid numeric values for the default quarter and metric
    const selectedQuarter = 'Q3_FY25';
    const metricType = 'volume';
    filteredData = allData.filter(row => {
        const val = cleanNumber(row[`${selectedQuarter}_${metricType.charAt(0).toUpperCase() + metricType.slice(1)}`]);
        return !isNaN(val) && val !== 0;
    });
    updateSubTypeOptions();
    updateSummary();
    updateTable();
    updateChart();
    updatePieCharts();
}

// Handle search
function handleSearch() {
    updateTable();
}

// Update summary statistics
function updateSummary() {
    const selectedQuarter = summaryQuarterSelect.value;
    summaryQuarterLabel.textContent = summaryQuarterSelect.options[summaryQuarterSelect.selectedIndex].text;
    const totalVolume = filteredData.reduce((sum, row) => {
        return sum + cleanNumber(row[`${selectedQuarter}_Volume`]);
    }, 0);
    
    const totalValue = filteredData.reduce((sum, row) => {
        return sum + cleanNumber(row[`${selectedQuarter}_Value`]);
    }, 0);
    
    const transactionTypes = new Set(filteredData.map(row => row['Transaction Type']));
    const subTypes = new Set(filteredData.map(row => row['Sub_type']));
    
    totalVolumeEl.textContent = formatNumber(totalVolume);
    totalValueEl.textContent = formatNumber(totalValue);
    transactionTypesCountEl.textContent = transactionTypes.size;
    subTypesCountEl.textContent = subTypes.size;
}

// Update table
function updateTable() {
    const searchTerm = searchInput.value.toLowerCase();
    const showFiltered = tableFilterSelect.value === 'filtered';
    const dataToShow = showFiltered ? filteredData : allData;
    
    const filteredForTable = dataToShow.filter(row => {
        const transactionType = row['Transaction Type'].toLowerCase();
        const subType = row['Sub_type'].toLowerCase();
        return transactionType.includes(searchTerm) || subType.includes(searchTerm);
    });
    
    tableBody.innerHTML = '';
    
    filteredForTable.forEach(row => {
        const tr = document.createElement('tr');
        
        const quarters = ['Q3_FY24', 'Q4_FY24', 'Q1_FY25', 'Q2_FY25', 'Q3_FY25'];
        const metricType = metricTypeSelect.value;
        
        tr.innerHTML = `
            <td>${row['Transaction Type']}</td>
            <td>${row['Sub_type']}</td>
            ${quarters.map(quarter => {
                return `<td class="number-format">${formatNumber(cleanNumber(row[`${quarter}_${metricType.charAt(0).toUpperCase() + metricType.slice(1)}`] || 0))}</td>`;
            }).join('')}
        `;
        
        tableBody.appendChild(tr);
    });
}

// Create chart
function createChart() {
    const ctx = document.getElementById('trendChart').getContext('2d');
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Q3 FY24', 'Q4 FY24', 'Q1 FY25', 'Q2 FY25', 'Q3 FY25'],
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false
                },
                legend: {
                    position: 'bottom',
                    align: 'center',
                    labels: {
                        usePointStyle: false,
                        generateLabels: function(chart) {
                            const datasets = chart.data.datasets;
                            return datasets.map((ds, i) => ({
                                text: ds.label,
                                fillStyle: ds.borderColor,
                                strokeStyle: ds.borderColor,
                                lineWidth: 4,
                                hidden: !chart.isDatasetVisible(i),
                                index: i
                            }));
                        },
                        boxWidth: 40,
                        boxHeight: 4,
                        borderRadius: 2,
                        font: {
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                    mode: 'nearest',
                    intersect: false,
                    callbacks: {
                        title: function(context) {
                            // Only show the label of the hovered line
                            return context[0].dataset.label;
                        },
                        label: function() { return ''; }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Value (Millions PKR)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Quarter'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'nearest'
            }
        }
    });
    
    updateChart();
}

// Update chart
function updateChart() {
    if (!chart) return;
    
    const metricType = metricTypeSelect.value;
    const quarters = ['Q3_FY24', 'Q4_FY24', 'Q1_FY25', 'Q2_FY25', 'Q3_FY25'];
    
    // Group data by transaction type and sub type
    const groupedData = {};
    
    filteredData.forEach(row => {
        const key = `${row['Transaction Type']} - ${row['Sub_type']}`;
        if (!groupedData[key]) {
            groupedData[key] = {
                label: key,
                data: quarters.map(quarter => {
                    let value = cleanNumber(row[`${quarter}_${metricType.charAt(0).toUpperCase() + metricType.slice(1)}`] || 0);
                    if (isNaN(value)) {
                        console.warn('NaN value in line chart for', row, quarter);
                    }
                    return value;
                }),
                borderColor: getRandomColor(),
                backgroundColor: getRandomColor(0.1),
                tension: 0.4,
                fill: false
            };
        }
    });
    
    // Limit to top 10 datasets for better visibility
    const datasets = Object.values(groupedData)
        .sort((a, b) => {
            const aTotal = a.data.reduce((sum, val) => sum + val, 0);
            const bTotal = b.data.reduce((sum, val) => sum + val, 0);
            return bTotal - aTotal;
        })
        .slice(0, 10);
    
    chart.data.datasets = datasets;
    chart.options.scales.y.title.text = metricType === 'volume' ? 'Volume (Millions)' : 'Value (Millions PKR)';
    chart.update();
}

// Generate random color
function getRandomColor(alpha = 1) {
    const colors = [
        '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
        '#1abc9c', '#e67e22', '#34495e', '#16a085', '#c0392b'
    ];
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    if (alpha < 1) {
        return color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
    }
    return color;
}

// Format number with commas
function formatNumber(num) {
    if (typeof num !== 'number') return num;
    
    if (num >= 1000) {
        return num.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    } else {
        return num.toFixed(2);
    }
}

// Export functionality
function exportToCSV() {
    const headers = ['Transaction Type', 'Sub_type', 'Q3_FY24_Volume', 'Q3_FY24_Value', 'Q4_FY24_Volume', 'Q4_FY24_Value', 'Q1_FY25_Volume', 'Q1_FY25_Value', 'Q2_FY25_Volume', 'Q2_FY25_Value', 'Q3_FY25_Volume', 'Q3_FY25_Value'];
    
    const csvContent = [
        headers.join(','),
        ...filteredData.map(row => 
            headers.map(header => {
                const value = row[header];
                return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
            }).join(',')
        )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pakistan_payment_data_filtered.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

// Add export button functionality
document.addEventListener('DOMContentLoaded', function() {
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export Filtered Data';
    exportBtn.className = 'btn-primary';
    exportBtn.style.marginTop = '10px';
    exportBtn.addEventListener('click', exportToCSV);
    
    const filtersSection = document.querySelector('.filters-section');
    filtersSection.appendChild(exportBtn);
});

function createPieCharts() {
    pieChartQuarters.forEach(quarter => {
        const ctx = document.getElementById(`pieChart_${quarter}`).getContext('2d');
        pieCharts[quarter] = new Chart(ctx, {
            type: 'pie',
            data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'right' },
                    title: { display: false }
                }
            }
        });
    });
    updatePieCharts();
}

function updatePieCharts() {
    const selectedTransactionType = transactionTypeSelect.value;
    const metricType = metricTypeSelect.value;
    if (selectedTransactionType === 'all') {
        pieChartQuarters.forEach(quarter => {
            const chart = pieCharts[quarter];
            if (chart) {
                chart.data.labels = [];
                chart.data.datasets[0].data = [];
                chart.data.datasets[0].backgroundColor = [];
                chart.update();
            }
        });
        return;
    }
    // Get all sub-types for the selected transaction type
    const rows = allData.filter(row => row['Transaction Type'] === selectedTransactionType);
    // Use a large color palette
    const colorPalette = [
        '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#16a085', '#c0392b',
        '#8e44ad', '#27ae60', '#d35400', '#2980b9', '#7f8c8d', '#e84393', '#fdcb6e', '#00b894', '#636e72', '#fd79a8',
        '#00cec9', '#6c5ce7', '#fab1a0', '#b2bec3', '#dfe6e9', '#e17055', '#00b8d4', '#b71540', '#f8c291', '#6ab04c',
        '#4834d4', '#130f40', '#535c68', '#30336b', '#be2edd', '#f6e58d', '#badc58', '#ff7979', '#eb4d4b', '#686de0',
        '#e056fd', '#7ed6df', '#e1b12c', '#0097e6', '#8c7ae6', '#fbc531', '#4cd137', '#487eb0', '#c23616', '#dff9fb'
    ];
    pieChartQuarters.forEach((quarter, i) => {
        const chart = pieCharts[quarter];
        if (chart) {
            // Prepare data for this quarter
            let dataArr = rows.map(row => {
                return {
                    label: row['Sub_type'],
                    value: cleanNumber(row[`${quarter}_${metricType.charAt(0).toUpperCase() + metricType.slice(1)}`] || 0)
                };
            });
            // Sort by value descending
            dataArr.sort((a, b) => b.value - a.value);
            let labels = dataArr.map(item => item.label);
            let data = dataArr.map(item => item.value);
            let colors = labels.map((_, idx) => colorPalette[(idx + i * 7) % colorPalette.length]);
            chart.data.labels = labels;
            chart.data.datasets[0].data = data;
            chart.data.datasets[0].backgroundColor = colors;
            chart.update();
        }
    });
}

function cleanNumber(val) {
    if (typeof val === 'string') val = val.replace(/[\s,\u00A0]+/g, '').trim();
    return parseFloat(val) || 0;
} 