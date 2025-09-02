import type { ReactNode } from "react";
import type { ILead } from "../interfaces/commonInterfaces";

export const envVars = {
    apiUrl : import.meta.env.VITE_API_URL
}

// Objeto para traducir las keys de collected_data a español
const keyTranslations: Record<string, string> = {
    'identification': '🪪 DNI/CUIT/CUIL',
    'has_coverage': '📜 Tiene cobertura',
    'coverage_type': '⛨ Tipo de cobertura',
    'payment_type': '⚠️ Regimen',
    'contract_type': '📝 Tipo de Afiliación',
    'family_ages': '👨‍👩‍👦 Edades del grupo',
    'age': '👴🏼 Edad',
    'monotributo_category': 'Categoría de monotributo',
};

// Objeto para traducir los valores de status a español, usando el array existente
const statusMap: Record<string, string> = {
    contacted: 'Contactado 👋',
    responded: 'Respondió 👀',
    completed: 'Completado 📌',
    quoted: 'Cotizado 🤞🏼',
    recontacted: 'Recontactado 📢',
};

export const leadCopyContent = (lead: ILead): string => {
    // 1. Información principal
    let result = `📞 Teléfono: ${lead.id}\n`;
    result += `👤Nombre: ${lead.name}\n`;
    result += `🤖 Bot: ${lead.is_active ? '🟢' : '🔴'}\n`;

    // 2. Traducción del estado
    const statusLabel = statusMap[lead.status] || lead.status;
    result += `ⓘ Estado: ${statusLabel}\n`;

    // 3. Formateo de la fecha de creación
    const createdAt = new Date(lead.created_at).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    result += `🗓️ Fecha de creación: ${createdAt}\n\n`;

    // 4. Procesar y traducir la data recopilada
    if (lead.collected_data != null && JSON.stringify(lead.collected_data)?.length > 4) {
        result += ` *📑 Datos Recopilados*\n`;
        for (const key in lead.collected_data) {
            if (Object.prototype.hasOwnProperty.call(lead.collected_data, key)) {
                const translatedKey = keyTranslations[key] || key;
                const value = (lead.collected_data as Record<string, unknown>)[key];
                result += `${translatedKey}: ${value}\n`;
            }
        }
    } else {
        result += ` *📑 NO hay Datos Recopilados*`;
    }


    return result;
};

// export const formatLeadDataForUI = (lead: ILead): ReactNode[] => {
//     const dataToDisplay: ReactNode[] = [];

//     // Información principal
//     dataToDisplay.push(<li key="id">📞 Teléfono: <span className="font-medium">{lead.id}</span></li>);
//     dataToDisplay.push(<li key="name">👤 Nombre: <span className="font-medium">{lead.name}</span></li>);
//     dataToDisplay.push(<li key="is_active">🤖 Bot: <span className="font-medium">{lead.is_active ? '🟢 Activo' : '🔴 Inactivo'}</span></li>);

//     // Estado del lead
//     const statusLabel = statusMap[lead.status] || lead.status;
//     dataToDisplay.push(<li key="status">Estado: <span className="font-medium">{statusLabel}</span></li>);

//     // Fecha de creación
//     const createdAt = new Date(lead.created_at).toLocaleDateString('es-AR', {
//         year: 'numeric',
//         month: '2-digit',
//         day: '2-digit',
//     });
//     dataToDisplay.push(<li key="created_at">🗓️ Fecha de creación: <span className="font-medium">{createdAt}</span></li>);

//     // Título para los datos recopilados
//     dataToDisplay.push(<li key="collected-title" className='pt-2 mt-2 font-semibold text-lg'>📑 Datos Recopilados</li>);

//     // Datos recopilados
//     for (const key in lead.collected_data) {
//         if (Object.prototype.hasOwnProperty.call(lead.collected_data, key)) {
//             const translatedKey = keyTranslations[key] || key;
//             const value = (lead.collected_data as Record<string, unknown>)[key];
//             dataToDisplay.push(
//                 <li key={key} className='list-none ml-4'>
//                     <span className='font-medium'>{translatedKey}:</span> {String(value)}
//                 </li>
//             );
//         }
//     }

//     return dataToDisplay;
// };

export const formatLeadDataForUI = (lead: ILead): { general: ReactNode[]; collected: ReactNode[] } => {
    const generalData: ReactNode[] = [];
    const collectedData: ReactNode[] = [];

    // Información principal
    generalData.push(<li key="id" className='text-sm'>📞 Teléfono: <span className="font-medium">{lead.id}</span></li>);
    generalData.push(<li key="name" className='text-sm'>👤 Nombre: <span className="font-medium">{lead.name}</span></li>);
    generalData.push(<li key="is_active" className='text-sm'>🤖 Bot: <span className="font-medium">{lead.is_active ? '🟢 Activo' : '🔴 Inactivo'}</span></li>);

    const statusLabel = statusMap[lead.status] || lead.status;
    generalData.push(<li key="status" className='text-sm'>ⓘ Estado: <span className="font-medium">{statusLabel}</span></li>);

    const createdAt = new Date(lead.created_at).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    generalData.push(<li key="created_at" className='text-sm'>🗓️ Fecha de creación: <span className="font-medium">{createdAt}</span></li>);

    // Procesar y traducir la data recopilada
    for (const key in lead.collected_data) {
        if (Object.prototype.hasOwnProperty.call(lead.collected_data, key)) {
            const translatedKey = keyTranslations[key] || key;
            const value = (lead.collected_data as Record<string, unknown>)[key];
            collectedData.push(
                <li key={key} className='text-sm list-none'>
                    <span className='font-medium'>{translatedKey}:</span> {String(value)}
                </li>
            );
        }
    }

    return { general: generalData, collected: collectedData };
};