import React, {Suspense, lazy, useRef} from 'react'
import CabHeader from './cabHeader'
import "../../styles/cabHeader.css"
const CabContent = lazy(() => import('./cabContent'))

const cabang = () => {
  const cabContentRef = useRef();
  const handleAddCabang = (newCabang) => {
    if (cabContentRef.current) {
      cabContentRef.current.handleAddCabang(newCabang);
    }
  };

  return (
    <div className='content'>
      <CabHeader onAddCabang={handleAddCabang}/>
      <Suspense 
        fallback={
          <div className="table-loading">
            <div className="loading-spinner"></div>
          </div>
        }>
        <CabContent ref={cabContentRef} />
      </Suspense>
    </div>
  )
}

export default cabang