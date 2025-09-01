import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { type ILead } from '../interfaces/IUser';

const LeadsDashboard = () => {
    const { token } = useAuth();
    const [leads, setLeads] = useState<ILead[]>([]);
    const [totalLeads, setTotalLeads] = useState(0);
    const [page, setPage] = useState(0);
    const [limit] = useState(10);
    const [filters, setFilters] = useState({
        id: '',
        name: '',
        is_active: '',
        status: '',
    });
    const [appliedFilters, setAppliedFilters] = useState(filters);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedRows, setExpandedRows] = useState<string[]>([]);

    const fetchLeads = async () => {
        if (!token) {
            setError('No estás autenticado.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const params = {
                skip: page * limit,
                limit: limit,
                lead_id: appliedFilters.id || undefined,
                name: appliedFilters.name || undefined,
                is_active: appliedFilters.is_active === 'true' ? true : appliedFilters.is_active === 'false' ? false : undefined,
                status: appliedFilters.status || undefined,
            };

            const response = await axios.get('http://127.0.0.1:8000/leads', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: params
            });

            setLeads(response.data.leads);
            setTotalLeads(response.data.total);
        } catch (err) {
            console.error('Error fetching leads:', err);
            setError('Error al cargar los leads. Por favor, intente de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, [page, limit, appliedFilters, token]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleApplyFilters = () => {
        setAppliedFilters(filters);
        setPage(0);
    };

    const handleNextPage = () => {
        if ((page + 1) * limit < totalLeads) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 0) {
            setPage(prevPage => prevPage - 1);
        }
    };

    const handleEdit = async (leadId: string, updatedData: Partial<ILead>) => {
        console.log(`Editando lead ${leadId} con datos:`, updatedData);
    };

    const toggleRow = (leadId: string) => {
        if (expandedRows.includes(leadId)) {
            setExpandedRows(expandedRows.filter(id => id !== leadId));
        } else {
            setExpandedRows([...expandedRows, leadId]);
        }
    };

    const copyCollectedData = (data: Record<string, string> | null) => {
        if (data) {
            const dataString = Object.entries(data)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n');
            navigator.clipboard.writeText(dataString);
        }
    };

    if (loading) return <div className="text-center" style={{ color: 'var(--color-light-text)' }}>Cargando leads...</div>;
    if (error) return <div className="text-center" style={{ color: 'var(--color-danger-red)' }}>{error}</div>;

    return (
        <div className='p-8 space-y-6' style={{ color: 'var(--color-darker-background)' }}>
            <h1 className='text-3xl font-bold text-center' style={{ color: 'var(--color-light-text)' }}>Dashboard de Leads</h1>
            
            <div className='flex flex-col md:flex-row items-center justify-center gap-4'>
                <input
                    type='text'
                    name='id'
                    placeholder='Filtrar por ID'
                    value={filters.id}
                    onChange={handleFilterChange}
                    className='px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2'
                    style={{ backgroundColor: 'var(--color-lighter-background)', color: 'var(--color-light-text)' }}
                />
                <input
                    type='text'
                    name='name'
                    placeholder='Filtrar por Nombre'
                    value={filters.name}
                    onChange={handleFilterChange}
                    className='px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2'
                    style={{ backgroundColor: 'var(--color-lighter-background)', color: 'var(--color-light-text)' }}
                />
                <select
                    name='is_active'
                    value={filters.is_active}
                    onChange={handleFilterChange}
                    className='px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2'
                    style={{ backgroundColor: 'var(--color-lighter-background)', color: 'var(--color-light-text)' }}
                >
                    <option value=''>Activo (Todos)</option>
                    <option value='true'>Activo</option>
                    <option value='false'>Inactivo</option>
                </select>
                <select
                    name='status'
                    value={filters.status}
                    onChange={handleFilterChange}
                    className='px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2'
                    style={{ backgroundColor: 'var(--color-lighter-background)', color: 'var(--color-light-text)' }}
                >
                    <option value=''>Estado (Todos)</option>
                    <option value='pending'>Pendiente</option>
                    <option value='completed'>Completado</option>
                    <option value='cancelled'>Cancelado</option>
                </select>
                <button
                    onClick={handleApplyFilters}
                    className='p-2 rounded-md text-sm font-medium border-1 border-gray-700'
                    style={{ backgroundColor: 'var(--color-primary-violet)', color: 'var(--color-light-text)' }}
                >
                    🔍︎ Buscar
                </button>
            </div>

            <div className='overflow-x-auto rounded-lg shadow-lg'>
                <table className='min-w-full divide-y divide-gray-700' style={{ backgroundColor: 'var(--color-lighter-background)' }}>
                    <thead style={{ backgroundColor: 'var(--color-darker-background)' }}>
                        <tr className='place-content-center text-center'>
                            <th scope='col' className='px-6 py-3 text-xs font-medium uppercase tracking-wider'>contacto 📱</th>
                            <th scope='col' className='px-6 py-3 text-xs font-medium uppercase tracking-wider'>Nombre 👤</th>
                            <th scope='col' className='px-6 py-3 text-xs font-medium uppercase tracking-wider'>Bot 🤖</th>
                            <th scope='col' className='px-6 py-3 text-xs font-medium uppercase tracking-wider'>Estado 📚</th>
                            <th scope='col' className='px-6 py-3 text-xs font-medium uppercase tracking-wider'>Creación 📅</th>
                            <th scope='col' className='px-6 py-3 text-xs font-medium uppercase tracking-wider'>Datos 🗂️</th>
                            <th scope='col' className='px-6 py-3 text-xs font-medium uppercase tracking-wider'>🛠</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-700'>
                        {leads.length > 0 ? (
                            leads.map((lead) => (
                                <>
                                    <tr key={lead.id} className='text-center'>
                                        <td className='px-6 py-4 whitespace-nowrap' style={{ color: 'var(--color-text-secondary)' }}>{lead.id}</td>
                                        <td className='px-6 py-4 whitespace-nowrap' style={{ color: 'var(--color-light-text)' }}>{lead.name}</td>
                                        <td className='px-6 py-4 whitespace-nowrap' style={{ color: lead.is_active ? 'var(--color-success-green)' : 'var(--color-danger-red)' }}>
                                            {lead.is_active ? '🟢' : '🔴'}
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap' style={{ color: 'var(--color-text-secondary)' }}>{lead.status}</td>
                                        <td className='px-6 py-4 whitespace-nowrap' style={{ color: 'var(--color-text-secondary)' }}>{lead.created_at.split('T')[0]}</td>
                                        <td className='px-6 py-4 whitespace-nowrap'>
                                            <button 
                                                onClick={() => lead.collected_data && toggleRow(lead.id)}
                                                disabled={!lead.collected_data || JSON.stringify(lead.collected_data).length < 5}
                                                className={`text-sm font-medium focus:outline-none ${JSON.stringify(lead?.collected_data).length > 4 ? 'text-green-200 hover:underline' : 'text-gray-500 cursor-not-allowed'}`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`w-5 h-5 inline-block transform transition-transform ${expandedRows.includes(lead.id) ? 'rotate-90' : 'rotate-0'}`}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                </svg>
                                                Ver Datos
                                            </button>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                            <button onClick={() => handleEdit(lead.id, lead)} className='text-blue-400 hover:text-blue-500'>Editar</button>
                                        </td>
                                    </tr>
                                    {expandedRows.includes(lead.id) && lead.collected_data && (
                                        <tr className='bg-gray-800/50'>
                                            <td colSpan={7} className='p-4'>
                                                <div className='flex items-center justify-between'>
                                                    <h4 className='text-sm font-semibold'>Datos Recopilados:</h4>
                                                    <button onClick={() => copyCollectedData(lead.collected_data)} className='text-xs text-blue-400 hover:underline'>Copiar Datos</button>
                                                </div>
                                                <ul className='mt-2 text-xs space-y-1'>
                                                    {Object.entries(lead.collected_data).map(([key, value]) => (
                                                        <li key={key}>
                                                            <span className='font-medium'>{key}:</span> {value}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className='px-6 py-4 text-center' style={{ color: 'var(--color-text-secondary)' }}>No se encontraron leads.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className='flex justify-between items-center mt-4'>
                <button
                    onClick={handlePrevPage}
                    disabled={page === 0}
                    className='px-4 py-2 rounded-md text-sm font-medium'
                    style={{ backgroundColor: 'var(--color-primary-violet)', color: 'white' }}
                >
                    Anterior
                </button>
                <span style={{ color: 'var(--color-text-secondary)' }}>Página {page + 1} de {Math.ceil(totalLeads / limit)}</span>
                <button
                    onClick={handleNextPage}
                    disabled={(page + 1) * limit >= totalLeads}
                    className='px-4 py-2 rounded-md text-sm font-medium'
                    style={{ backgroundColor: 'var(--color-primary-violet)', color: 'white' }}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default LeadsDashboard;