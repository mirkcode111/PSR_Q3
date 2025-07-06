# Pakistan Retail Payment System Dashboard

A comprehensive web-based dashboard for analyzing Pakistan's retail payment system data from FY24 to FY25. This interactive dashboard provides real-time data visualization, filtering capabilities, and trend analysis for various payment transaction types.

## Features

### 📊 Interactive Dashboard
- **Real-time Data Loading**: Automatically imports data from `data.csv`
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with gradient backgrounds and glass-morphism effects

### 🔍 Advanced Filtering
- **Transaction Type Filter**: Filter by specific payment channels (ATM, POS, IB, MB, etc.)
- **Sub Type Filter**: Filter by specific transaction categories within each type
- **Dynamic Filtering**: Sub-type options update based on selected transaction type
- **Metric Selection**: Toggle between Volume (Millions) and Value (Millions PKR)

### 📈 Data Visualization
- **Interactive Line Charts**: Trend analysis using Chart.js
- **Quarterly Comparison**: View trends across 5 quarters (Q3 FY24 to Q3 FY25)
- **Top 10 Visualization**: Automatically shows top 10 transaction types by volume/value
- **Real-time Updates**: Charts update instantly when filters are applied

### 📋 Data Management
- **Summary Statistics**: Key metrics displayed in summary cards
- **Searchable Data Table**: Full data table with search functionality
- **Export Capability**: Download filtered data as CSV
- **Data Validation**: Handles missing values and special characters

## File Structure

```
PSR_Q3/
├── index.html          # Main dashboard HTML structure
├── styles.css          # Modern CSS styling with responsive design
├── script.js           # JavaScript functionality and data processing
├── data.csv            # Pakistan retail payment system data
└── README.md           # This documentation file
```

## Data Structure

The dashboard processes the following data columns:
- **Transaction Type**: Payment channels (ATM, POS, IB, MB, etc.)
- **Sub_type**: Specific transaction categories
- **Quarterly Data**: Volume and Value for Q3 FY24 through Q3 FY25

## How to Use

### 1. Setup
1. Ensure all files are in the same directory
2. Open `index.html` in a modern web browser
3. The dashboard will automatically load the data from `data.csv`

### 2. Filtering Data
1. **Select Transaction Type**: Choose from dropdown to filter by payment channel
2. **Select Sub Type**: Choose specific transaction category (updates based on transaction type)
3. **Choose Metric**: Toggle between Volume and Value
4. **Apply Filters**: Click "Apply Filters" to update all visualizations
5. **Reset**: Click "Reset" to clear all filters

### 3. Viewing Trends
- The line chart automatically displays trends for the top 10 transaction types
- Hover over chart lines to see detailed values
- Chart updates automatically when filters are applied

### 4. Data Table
- View all data in a searchable table format
- Use the search box to find specific transactions
- Toggle between "All Data" and "Filtered Data" views

### 5. Export Data
- Click "Export Filtered Data" to download current filtered data as CSV

## Technical Details

### Technologies Used
- **HTML5**: Semantic structure and accessibility
- **CSS3**: Modern styling with Flexbox and Grid layouts
- **JavaScript (ES6+)**: Dynamic functionality and data processing
- **Chart.js**: Interactive data visualization
- **Fetch API**: Asynchronous data loading

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Data Processing
- **CSV Parsing**: Custom parser handles quoted values and special characters
- **Data Validation**: Converts string values to numbers, handles missing data
- **Real-time Updates**: All components update simultaneously when filters change

## Key Features Explained

### Responsive Design
The dashboard uses CSS Grid and Flexbox for responsive layouts:
- Desktop: Sidebar filters with main content area
- Tablet: Stacked layout with full-width sections
- Mobile: Optimized for touch interaction

### Data Visualization
- **Chart.js Integration**: Professional line charts with hover effects
- **Color Coding**: Distinct colors for different transaction types
- **Performance**: Limits to top 10 datasets for optimal performance

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast color scheme

## Customization

### Styling
Modify `styles.css` to customize:
- Color scheme
- Layout dimensions
- Typography
- Animation effects

### Functionality
Extend `script.js` to add:
- Additional chart types
- More filtering options
- Data export formats
- Real-time data updates

## Troubleshooting

### Common Issues

1. **Data Not Loading**
   - Ensure `data.csv` is in the same directory as `index.html`
   - Check browser console for error messages
   - Verify CSV file format and encoding

2. **Charts Not Displaying**
   - Ensure internet connection (Chart.js is loaded from CDN)
   - Check browser compatibility
   - Verify JavaScript is enabled

3. **Filtering Not Working**
   - Refresh the page to reload data
   - Check for JavaScript errors in console
   - Verify data format in CSV file

## Future Enhancements

Potential improvements for the dashboard:
- Additional chart types (bar charts, pie charts)
- Date range filtering
- Real-time data updates
- User preferences and saved filters
- Advanced analytics and forecasting
- Multi-language support

## License

This project is open source and available under the MIT License.

## Support

For technical support or feature requests, please refer to the project documentation or create an issue in the repository. 