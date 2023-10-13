import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DriverProfile from './driverProfile';
import styles from './styles/driverProfile.module.css';

// Custom hook for fetching driver data
const useFetchDriverData = (page) => {
    const [driverData, setDriverData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDriverData = async () => {
            try {
                const data = await new Promise(resolve => setTimeout(() => {
                    resolve({
                        name: `John Doe Page ${page}`,
                        licenseNumber: "XYZ12345",
                        vehicle: "Toyota Prius",
                        rating: 4.8
                    });
                }, 1000));

                setDriverData(data);
            } catch (fetchError) {
                setError('Failed to fetch driver data.');
            }
        };

        fetchDriverData();
    }, [page]);

    return { driverData, error };
};

const DriverProfilePage = () => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, ] = useState(5);
    const { driverData, error } = useFetchDriverData(currentPage);
  


    useEffect(() => {
        const isAuthenticated = true;
        const isDriver = true;

        if (!isAuthenticated || !isDriver) {
            router.push('/login');
            return;
        }

        // Initialize total pages and current page if needed
        // setTotalPages(10);
        // setCurrentPage(1);

    }, [router]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

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

                <button onClick={handlePrevPage} className={styles.prevPageBtn} disabled={currentPage === 1}>Previous Profile</button>
                <button onClick={handleNextPage} className={styles.nextPageBtn} disabled={currentPage === totalPages}>Next Profile</button>
                <button className={styles.editBtn}>Edit Profile</button>
                <button className={styles.safetyBtn}>View Safety Guidelines</button>
                <button className={styles.vehicleBtn}>Change Vehicle Details</button>
            </main>
        </div>
    );
};

export default DriverProfilePage;
