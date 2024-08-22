const axios = require('axios');
const accessToken = '1000.742ac2d8bbefe63e9daeaf63f9c925d3.8c2bda6ed47393e0c22c0c34914e236e';
const apiURL = 'https://www.zohoapis.com/crm/v2/Leads';

const convertirCampos = (datos) => {
    return {
        "First_Name": datos['First Name'],
        "Last_Name": datos['Last Name'],
        "Company": datos['Company'],
        "Title": datos['Title'],
        "Email": datos['Email'],
        "Lead_Source": datos['Lead Source'],
        "Lead_Status": datos['Lead Status'],
    };
};

const crearLead = async (datos) => {
    try {
        const datosConvertidos = convertirCampos(datos);
        console.log("Datos enviados a Zoho CRM:", datosConvertidos);
        const response = await axios.post(apiURL, {
            data: [datosConvertidos]
        }, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Respuesta de Zoho CRM:', response.data);
        if (response.data.data && response.data.data.length > 0) {
            const leadDatos = response.data.data[0];
            const id = leadDatos.id || 'ID no encontrado';
            console.log(`Crear Lead - ID: ${id}`);
            return id;
        } else {
            console.error('No se encontro el ID en la respuesta de Zoho');
        }
    } catch (error){
        if (error.response){
            console.error('error al crear lead:', error.response.data);
        }
        console.error('Error al crear Lead:', error.message);
    }
};

const eliminarLead = async (id) => {
    try {
        const response = await axios.delete(`${apiURL}/${id}`, {
            headers: {
                'Authorization': `Zoho-oauthtoken ${accessToken}`,
                'Content-Type': 'application/json' 
            }
        });
        if (response.data.data && response.data.data.length > 0) {
            console.log(`Lead ID: ${id} eliminado correctamente`);
            return response.data;
        } else {
            console.error('No se encontro el ID a eliminar');
        }
    } catch (error) {
        if (error.response) {
            console.error('Error al eliminar Lead:', error.response.data);
        }
        console.error('Error al eliminar Lead:', error.message);
    }
};

module.exports = { crearLead, eliminarLead };