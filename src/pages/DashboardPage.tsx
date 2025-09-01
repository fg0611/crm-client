import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import type { ILead } from '../interfaces/IUser';

const LeadsDashboard = () => {
    const { token } = useAuth();
    const [leads, setLeads] = useState<ILead[]>([]);
    const [totalLeads, setTotalLeads] = useState(0);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [filters, setFilters] = useState({
        id: '',
        name: '',
        is_active: '',
        status: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                lead_id: filters.id || undefined,
                name: filters.name || undefined,
                is_active: filters.is_active === 'true' ? true : filters.is_active === 'false' ? false : undefined,
                status: filters.status || undefined,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
        setPage(0); // Resetear la paginación al cambiar los filtros
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

    // Lógica para editar leads (se implementará en futuros pasos)
    const handleEdit = async (leadId: string, updatedData: Partial<ILead>) => {
        // Implementar la llamada PUT a la API
        console.log(`Editando lead ${leadId} con datos:`, updatedData);
    };

    if (loading) return <div className="text-center" style={{ color: 'var(--color-light-text)' }}>Cargando leads...</div>;
    if (error) return <div className="text-center" style={{ color: 'var(--color-danger-red)' }}>{error}</div>;

    return (
        <div className='p-8 space-y-6' style={{ color: 'var(--color-light-text)' }}>
            <h1 className='text-3xl font-bold text-center' style={{ color: 'var(--color-light-text)' }}>Dashboard de Leads</h1>
            
            <div className='flex flex-col md:flex-row items-center justify-center gap-4'>
                <input
                    type='text'
                    name='id'
                    placeholder='Filtrar por ID'
                    value={filters.id}
                    onChange={handleFilterChange}
                    className='px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2'
                    style={{ backgroundColor: 'var(--color-lighter-background)' }}
                />
                <input
                    type='text'
                    name='name'
                    placeholder='Filtrar por Nombre'
                    value={filters.name}
                    onChange={handleFilterChange}
                    className='px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2'
                    style={{ backgroundColor: 'var(--color-lighter-background)' }}
                />
                <select
                    name='is_active'
                    value={filters.is_active}
                    onChange={handleFilterChange}
                    className='px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2'
                    style={{ backgroundColor: 'var(--color-lighter-background)' }}
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
                    style={{ backgroundColor: 'var(--color-lighter-background)' }}
                >
                    <option value=''>Estado (Todos)</option>
                    <option value='pending'>Pendiente</option>
                    <option value='completed'>Completado</option>
                    <option value='cancelled'>Cancelado</option>
                </select>
                <button
                    onClick={fetchLeads}
                    className='px-4 py-2 rounded-md text-sm font-medium'
                    style={{ backgroundColor: 'var(--color-primary-violet)', color: 'white' }}
                >
                    Filtrar
                </button>
            </div>

            <div className='overflow-x-auto rounded-lg shadow-lg'>
                <table className='min-w-full divide-y divide-gray-700' style={{ backgroundColor: 'var(--color-lighter-background)' }}>
                    <thead style={{ backgroundColor: 'var(--color-darker-background)' }}>
                        <tr>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>ID</th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Nombre</th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Activo</th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Estado</th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Datos</th>
                            <th scope='col' className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-700'>
                        {leads.length > 0 ? (
                            leads.map((lead) => (
                                <tr key={lead.id}>
                                    <td className='px-6 py-4 whitespace-nowrap'>{lead.id}</td>
                                    <td className='px-6 py-4 whitespace-nowrap'>{lead.name}</td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        {lead.is_active ? 'Sí' : 'No'}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>{lead.status}</td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        {JSON.stringify(lead.collected_data)}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                        <button onClick={() => alert('Función de editar')} className='text-primary-blue-400 hover:text-primary-blue-500'>Editar</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className='px-6 py-4 text-center'>No se encontraron leads.</td>
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
