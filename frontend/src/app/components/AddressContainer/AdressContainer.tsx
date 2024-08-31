import React from 'react';
import styles from './AdressContainer.module.css';

interface AddressData {
    Name?: string;  
    Region?: string;
    District?: string;
    State?: string;
}

const adressFields = ['Name', 'Region', 'District', 'State'] as const;

const AdressContainer: React.FC<AddressData> = ({ Name, Region, District, State }) => {
    const data = { Name, Region, District, State };

    return (
        <div className={styles.container}>
            {adressFields.map((item, index) => (
                <span key={index}>
                    <label htmlFor={item}>{item}:</label>
                    <p>{data[item]}</p> {/* Accessing data dynamically */}
                </span>
            ))}
        </div>
    );
};

export default AdressContainer;
