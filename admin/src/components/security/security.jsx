import React, { Suspense, lazy, useRef } from 'react';
import SecHeader from './secHeader';
import "../../styles/secHeader.css";
const SecContent = lazy(() => import('./secContent'));

const Security = () => {
  const secContentRef = useRef();
  const handleAddSecurity = (newSecurity) => {
    if (secContentRef.current) {
      secContentRef.current.handleAddSecurity(newSecurity);
    }
  };

  return (
    <div>
      <SecHeader onAddSecurity={handleAddSecurity} />
      <Suspense 
        fallback={
          <div className="table-loading">
            <div className="loading-spinner"></div>
          </div>
        }>
        <SecContent ref={secContentRef} />
      </Suspense>
    </div>
  );
};

export default Security;