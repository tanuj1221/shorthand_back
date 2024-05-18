import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../App.css'
import * as XLSX from 'xlsx';
const UpdateTable = () => {
    const [data, setData] = useState([]);
    const [selectedVal, setSelectedVal] = useState('');
    const [originalData, setOriginalData] = useState([]);

    const handleSelectChange = (event) => {
        setSelectedVal(event.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://3.110.77.175:3000/table/${selectedVal}`);
                setData(response.data);
                setOriginalData(response.data);
            } catch (error) {
                console.error('Failed to fetch table data:', error);
            }
        };

        if (selectedVal) {
            fetchData();
        }
    }, [selectedVal]);

    const renderTableHeader = () => {
        if (data.length === 0) return null;

        return Object.keys(data[0]).map(key => (
            <th key={key}>{key.toUpperCase()}</th>
        ));
    };
    const downloadExcel = () => {
        // Ensure there is data to export
        if (data.length === 0) {
            alert("No data to download!");
            return;
        }
    
        // Create a new workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);
    
        // Add the worksheet to the workbook under the name "Data"
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    
        // Define a file name
        const fileName = `${selectedVal}_data.xlsx`;
    
        // Trigger the file download
        XLSX.writeFile(workbook, fileName);
    };

    const renderTableRows = () => {
        return data.map((row, index) => (
            <tr key={index}>
                {Object.keys(row).map((key) => (
                    <td key={`${index}_${key}`}>
                        <input
                            type="text"
                            value={row[key]}
                            onChange={(e) => handleChange(e.target.value, index, key)}
                        />
                    </td>
                ))}
            </tr>
        ));
    };

    const handleChange = (value, rowIndex, columnKey) => {
        const updatedData = data.map((item, index) => {
            if (index === rowIndex) {
                return { ...item, [columnKey]: value };
            }
            return item;
        });
        setData(updatedData);
    };

    const handleReset = () => {
        setData(originalData);
    };

    const handleSave = async () => {
        try {
            // Make a POST request to save the updated data to the database
            console.log("data: "+data);
            await axios.post(`http://3.110.77.175:3000/save-table/${selectedVal}`, data);

            console.log('Data saved successfullyy!');
            alert("Data saved!");
        } catch (error) {
            console.error('Failed to save data:', error);
        }
    };

    return (
        <div>
            <div>
                <h2>Update table</h2>
                <select value={selectedVal} onChange={handleSelectChange}>
                    <option value="">Select a table</option>
                    <option value="student14">student</option>
                    <option value="admindb">admin</option>
                    <option value="coursesdb1">coursedb</option>
                    <option value="institutedb">institutedb</option>
                    <option value="subjectdb">subjectdb</option>
                    <option value="audiodb1">audio db</option>
                    <option value="savedata">saved db</option>
                </select>
                {selectedVal && <p>Selected: {selectedVal}</p>}
            </div>
            <div className="table-container">
                <table className="custom-table">
                    <thead>
                        <tr>{renderTableHeader()}</tr>
                    </thead>
                    <tbody>
                        {renderTableRows()}
                    </tbody>
                </table>
            </div>
            <div>
                <button onClick={handleSave}>Save</button>
                <button onClick={handleReset}>Reset</button>
                <button onClick={downloadExcel}>Download Excel</button>
            </div>
        </div>
    );
};

export default UpdateTable;