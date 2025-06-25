import React from 'react';

const ContentHeader = ({ cabangOptions, selectedCabang, onCabangChange, onSearch }) => {
  return (
    <div className="content--header">
      <h2 className="header--title">Dashboard</h2>
      <div className="filter-wrapper" style={{ justifyContent: 'center' }}>
        <div className="filter-container">
          <select
            id="cabang-select"
            value={selectedCabang}
            onChange={(e) => onCabangChange(e.target.value)}
          >
            <option value="">Semua Cabang</option>
            {cabangOptions.map((cabang) => (
              <option key={cabang} value={cabang}>
                {cabang}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ContentHeader;
