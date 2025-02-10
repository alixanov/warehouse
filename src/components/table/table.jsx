import React from 'react';
import './table.css';

const Table = ({ children }) => {
    return (
        <table className='table'>
            {children}
        </table>
    );
};


export default Table;