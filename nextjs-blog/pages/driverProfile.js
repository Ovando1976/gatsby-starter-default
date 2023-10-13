import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DriverProfile from './driverProfile';
import styles from './styles/driverProfile.module.css';


const DriverProfilePage = () => {
    const router = useRouter();
    const [driverData, setDriverData] = useState(null);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Pagination state
    const [totalPages, setTotalPages] = useState(5);  // Assuming a total of 5 pages


    // Pagination function
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        }
      // call paginate somewhere in your code
      paginate(1);
      
      // call setTotalPages somewhere in your code
      setTotalPages(10);

    useEffect(() => {
        const isAuthenticated = true; 
        const isDriver = true; 

        if (!isAuthenticated || !isDriver) {
            router.push('/login');
            return;
        }

        const fetchDriverData = async () => {
            try {
                if (currentPage <= totalPages) { // Pagination check
                    const data = await new Promise(resolve => setTimeout(() => {
                        resolve({
                            name: `John Doe Page ${currentPage}`,
                            licenseNumber: "XYZ12345",
                            vehicle: "Toyota Prius",
                            rating: 4.8
                        });
                    }, 1000));

                    setDriverData(data);
                } else {
                    setError('No more driver profiles available.');
                }
            } catch (fetchError) {
                setError('Failed to fetch driver data.');
            }
        };

        fetchDriverData();
    }, [currentPage, router, totalPages]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }

    return (
        <div className={styles.container}>
            <main className={styles.content}>
                <h1>Driver Profile</h1>

                {error && <p className={styles.error}>{error}</p>}
                
                {driverData ? (
                    <DriverProfile data={driverData} />
                ) : (
                    <p>Loading driver details...</p>
                )}

                <button onClick={handleNextPage} className={styles.nextPageBtn}>Next Profile</button>
                <button className={styles.editBtn}>Edit Profile</button>
                <button className={styles.safetyBtn}>View Safety Guidelines</button>
                <button className={styles.vehicleBtn}>Change Vehicle Details</button>
            </main>
        </div>
    );
};

export default DriverProfilePage;




