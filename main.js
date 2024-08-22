const fs = require('fs');
const axios = require('axios');
const csv = require('csv-parser');
const { crearLead, eliminarLead} = require('./index');
const resultadosFiltrados = [];

const camposObligatorios = [
    'First Name',
    'Last Name',
    'Company',
    'Title',
    'Email',
    'Lead Source',
    'Lead Status'
];
const valoresLeadSource = [
    'Advertisement',
    'Cold Call',
    'Employee Referral',
    'External Referral',
    'Twitter',
    'Facebook',
    'LinkedIn'
];

const valoresLeadStatus = [
    'Contact in Future',
    'Contacted'
];

const leerCsv = async () => {
    await new Promise((resolve, reject) => {
        fs.createReadStream('./leads - leads.csv.csv')
        .pipe(csv())
        .on('data', (row) => {
            const camposObligatoriosOk = camposObligatorios.every(field => row[field] !== undefined && row[field] !== null && row[field].trim() !== '');
            const valoresLeadSourceOk = valoresLeadSource.includes(row['Lead Source']);
            const valoresLeadStatusOk = valoresLeadStatus.includes(row['Lead Status']);

            if (camposObligatoriosOk && valoresLeadSourceOk && valoresLeadStatusOk) {
                if(row['Lead Source'] === 'Facebook') {
                    eliminarLead(row['id']);
                } else {
                    resultadosFiltrados.push(row);
                }
            }
        })
        .on('end', () => {
            console.log('Archivo csv leido correctamente');
            resolve();
        })
        .on('error', (error) => {
            reject(error);
        });
    })
    for (const datos of resultadosFiltrados) {
        try {
            const id = await crearLead(datos);
            console.log(`Lead creado con ID: ${id}`);
        } catch (error) {
            console.error('Error al crear lead:', error);
        }
    }
};
leerCsv();
