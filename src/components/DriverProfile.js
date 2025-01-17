/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker, Popup } from "../utils/dynamicLeaflet";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import styles from "../../pages/styles/driverProfile.module.css";

const DriverProfile = ({ data }) => {
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const mapRef = useRef(null);

    const vehicles = [
        { id: 1, name: "Sedan", image: "/wrangler-jeep.webp", description: "Comfortable for city rides." },
        { id: 2, name: "SUV", image: "/jeep.webp", description: "Spacious and perfect for families." },
        { id: 3, name: "Truck", image: "/truck.webp", description: "Ideal for transporting goods." },
        { id: 4, name: "Bike", image: "/motorcycle.webp", description: "Quick and efficient for short trips." },
    ];

    const handleVehicleSelect = (vehicle) => {
        setSelectedVehicle(vehicle);
    };

    const mapCenter = [18.3419, -64.9307];

    const handlePrintSummary = async () => {
        try {
            const canvas = await html2canvas(mapRef.current);
            const mapImage = canvas.toDataURL("image/png");

            const pdf = new jsPDF();
            pdf.setFontSize(18);
            pdf.text("Trip Summary", 10, 20);

            pdf.setFontSize(12);
            pdf.text(`Driver: ${data.name}`, 10, 40);
            pdf.text(`Address: ${data.address}`, 10, 50);
            pdf.text(`License: ${data.licenseNumber}`, 10, 60);

            pdf.text(`Vehicle: ${selectedVehicle?.name || "N/A"}`, 10, 70);
            pdf.text(`Description: ${selectedVehicle?.description || "N/A"}`, 10, 80);

            pdf.addImage(mapImage, "PNG", 10, 90, 190, (canvas.height * 190) / canvas.width);

            pdf.save("trip-summary.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    return (
        <div className={styles.driverProfileContainer}>
            <div className={styles.row}>
                <div className={styles.bookingComponent}>
                    <h2>Booking</h2>
                    <button className={styles.bookButton} onClick={handlePrintSummary}>
                        Print Trip Summary
                    </button>
                </div>
                <div className={styles.licenseCard}>
                    <div className={styles.licenseHeader}>
                        <h2>Driver's License</h2>
                    </div>
                    <div className={styles.licenseBody}>
                        // eslint-disable-next-line react/jsx-no-comment-textnodes
                        <div className={styles.photoContainer}>
                            // eslint-disable-next-line jsx-a11y/img-redundant-alt
                            <img src="/jane-doe.webp" alt="Driver Photo" className={styles.photo} />
                        </div>
                        <div className={styles.details}>
                            <p><strong>Name:</strong> {data.name}</p>
                            <p><strong>Address:</strong> {data.address}</p>
                            <p><strong>License Number:</strong> {data.licenseNumber}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.vehicleSelection}>
                    <h2>Select a Vehicle</h2>
                    <div className={styles.vehicleList}>
                        {vehicles.map((vehicle) => (
                            <div
                                key={vehicle.id}
                                className={`${styles.vehicleItem} ${selectedVehicle?.id === vehicle.id ? styles.selected : ""}`}
                                onClick={() => handleVehicleSelect(vehicle)}
                            >
                                // eslint-disable-next-line jsx-a11y/img-redundant-alt
                                <img src={vehicle.image} alt={`${vehicle.name} Image`} className={styles.vehicleImage} />
                                <p>{vehicle.name}</p>
                                <small>{vehicle.description}</small>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div ref={mapRef} className={styles.mapContainer}>
                <h3>Location</h3>
                {typeof window !== "undefined" && MapContainer && (
                    <MapContainer center={mapCenter} zoom={13} style={{ height: "60vh", width: "100%" }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; OpenStreetMap contributors"
                        />
                        <Marker position={mapCenter}>
                            <Popup>Charlotte Amalie, St. Thomas, USVI</Popup>
                        </Marker>
                    </MapContainer>
                )}
            </div>
        </div>
    );
};

DriverProfile.propTypes = {
    data: PropTypes.shape({
        name: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        licenseNumber: PropTypes.string.isRequired,
    }),
};

export default DriverProfile;