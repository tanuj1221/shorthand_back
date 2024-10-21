import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './UpdateTable.css';
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
                const response = await axios.get(`http://shorthandexam.in/table/${selectedVal}`);
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
        if (data.length === 0) {
            alert("No data to download!");
            return;
        }
    
        const headers = Object.keys(data[0]);
        let csvContent = headers.join(",") + "\n";
    
        data.forEach((row) => {
            const rowValues = headers.map((header) => {
                let value = row[header] || "";
                value = value.toString().replace(/,/g, "");
                return value;
            });
            csvContent += rowValues.join(",") + "\n";
        });
    
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const fileName = `${selectedVal}_data.csv`;
    
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", fileName);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
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
                            className="update-table__input"
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
            await axios.post(`http://shorthandexam.in/save-table/${selectedVal}`, data);
            console.log('Data saved successfully!');
            alert("Data saved!");
        } catch (error) {
            console.error('Failed to save data:', error);
        }
    };

    return (
        <div className="update-table">
            <div className="update-table__header">
                <h2 className="update-table__title">Update Table</h2>
                <select className="update-table__select" value={selectedVal} onChange={handleSelectChange}>
                    <option value="">Select a table</option>
                    <option value="student14">Student</option>
                    <option value="admindb">Admin</option>
                    <option value="coursesdb1">Course DB</option>
                    <option value="institutedb">Institute DB</option>
                    <option value="subjectdb">Subject DB</option>
                    <option value="audiodb1">Audio DB</option>
                    <option value="savedata">Saved DB</option>
                    <option value="qrpay">QR Pay</option>
                </select>
                {selectedVal && <p className="update-table__selected">Selected: {selectedVal}</p>}
            </div>
            <div className="update-table__container">
                <table className="update-table__table">
                    <thead>
                        <tr>{renderTableHeader()}</tr>
                    </thead>
                    <tbody>
                        {renderTableRows()}
                    </tbody>
                </table>
            </div>
            <div className="update-table__actions">
                <button className="update-table__button update-table__button--save" onClick={handleSave}>Save</button>
                <button className="update-table__button update-table__button--reset" onClick={handleReset}>Reset</button>
                <button className="update-table__button update-table__button--download" onClick={downloadExcel}>Download Excel</button>
            </div>
        </div>
    );
};

export default UpdateTable;