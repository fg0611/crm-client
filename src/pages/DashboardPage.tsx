import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { type ILead, type ILeadUpdate } from '../interfaces/commonInterfaces';
import { RefreshCcw, Search, XCircle } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { activeOptions, statusOptions } from '../others/options';
import type { FilterFormInputs } from '../others/types';
import { initialFilter } from '../others/filters';
import { tableColumnNames } from '../others/labels';
import { Eye, Edit, Copy } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';
import EditLeadModal from '../components/EditLeadModal';
import { leadCopyContent, formatLeadDataForUI, envVars } from '../others/helpers';

const DashboardPage = () => {
    const { token, logout } = useAuth();
    const [leads, setLeads] = useState<ILead[]>([]);
    const [totalLeads, setTotalLeads] = useState(0);
    const [page, setPage] = useState(0);
    const [limit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedRows, setExpandedRows] = useState<string[]>([]);
    const [appliedFilters, setAppliedFilters] = useState<FilterFormInputs>(initialFilter);
    const [editingLead, setEditingLead] = useState<ILeadUpdate | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const { register, handleSubmit, reset } = useForm<FilterFormInputs>({
        defaultValues: initialFilter,
    });

    const fetchLeads = useCallback(async () => {
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

            const response = await axios.get(envVars.apiUrl + '/leads', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: params,
            });
            setLeads(response.data.leads);
            setTotalLeads(response.data.total);

        } catch (err) {
            console.error('Error fetching leads:', err);
            setError('Error al cargar leads.');
        } finally {
            setLoading(false);
        }
    }, [token, page, limit, appliedFilters]);

    useEffect(() => {
        void fetchLeads();
    }, [fetchLeads]);

    const handleSearch: SubmitHandler<FilterFormInputs> = (data) => {
        setPage(0); // Reiniciar a la primera página al aplicar un nuevo filtro
        setAppliedFilters(data);
    };

    const handleClear = () => {
        reset(initialFilter);
        setPage(0);
        setAppliedFilters(initialFilter);
    };

    const handleRefresh = () => {
        setPage(0);
        void fetchLeads();
    };

    const handleNextPage = () => {
        setPage(prev => prev + 1);
    };

    const handlePrevPage = () => {
        setPage(prev => prev - 1);
    };

    const toggleRowExpansion = (id: string) => {
        setExpandedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const handleEdit = ({ id, name, is_active, status }: ILead) => {
        setEditingLead({ id, name, is_active, status })
        setIsModalOpen(!isModalOpen)
    }

    const handleSave = async ({ name, is_active, status }: ILeadUpdate) => {
        if (!editingLead) return;

        try {
            const response = await axios.put(`${envVars.apiUrl}/leads/${editingLead.id}`, { name, is_active, status }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Actualizar el estado de la tabla con el lead actualizado
            setLeads(leads.map(lead => lead.id === editingLead.id ? response.data : lead));
            // Cerrar el modal
            setIsModalOpen(false);
            setEditingLead(null);
            console.log('Lead actualizado con éxito:', response.data);
        } catch (err) {
            console.error('Error al actualizar el lead:', err);
            setError('Error al actualizar el lead.');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingLead(null);
    };

    if (error) {
        return <div className="text-center text-red-500 mt-8">Error: {error}</div>;
    }

    return (
        <div className='container mx-auto p-4' style={{ color: 'var(--color-light-text)' }}>
            <div className='flex justify-between py-3'>
                <h1 className='text-2xl font-bold text-center' style={{ color: 'var(--color-light-text)' }}>Dashboard de Leads</h1>
                <Button onClick={logout} >
                    {'Cerrar sesión'}
                </Button>
            </div>
            <form onSubmit={handleSubmit(handleSearch)} className='mb-4 flex gap-4 justify-center'>
                <div className='flex flex-wrap gap-4 place-content-center'>
                    <div className="flex flex-col gap-2 place-content-center">
                        <Input
                            hasLabel={false}
                            label="ID del Lead"
                            id="id"
                            type="text"
                            placeholder="Buscar por Tlf"
                            register={register}
                            errors={null}
                            stateKey="id"
                        />
                        <Input
                            hasLabel={false}
                            label="Nombre"
                            id="name"
                            type="text"
                            placeholder="Buscar por nombre"
                            register={register}
                            errors={null}
                            stateKey="name"
                        />

                    </div>
                    <div className="flex flex-col gap-2 place-content-center">
                        <Select
                            hasLabel={false}
                            label="Estado Activo"
                            id="is_active"
                            options={activeOptions}
                            register={register}
                            stateKey="is_active"
                        />
                        <Select
                            hasLabel={false}
                            label="Estado del Lead"
                            id="status"
                            options={statusOptions}
                            register={register}
                            stateKey="status"
                        />
                    </div>

                    {/* Contenedor de los botones, ahora fuera del flex-grow para que siempre tengan su propio espacio */}
                    <div className='flex flex-wrap gap-2 place-items-center'>
                        <Button type='submit' className="flex items-center gap-2">
                            <Search size={12} />
                            <span>Buscar</span>
                        </Button>
                        <Button type='button' onClick={handleClear} className="flex items-center gap-2">
                            <XCircle size={12} />
                            <span>Limpiar</span>
                        </Button>
                        <Button type='button' onClick={handleRefresh} className="flex items-center gap-2">
                            <RefreshCcw size={12} />
                            <span>Actualizar</span>
                        </Button>
                    </div>

                </div>

            </form>

            {/* Tabla de Leads */}
            <div className='overflow-x-auto rounded-lg shadow-lg' style={{ backgroundColor: 'var(--color-lighter-background)' }}>
                <TooltipProvider>
                    <table className='min-w-full divide-y' style={{ borderColor: 'var(--color-text-secondary)' }}>
                        <thead className='bg-gray-700'>
                            <tr className='text-center'>
                                {Object.keys(tableColumnNames).map((k: string) => <th key={`tcol-${k}`} scope='col' className='px-2 py-2 text-xs font-medium uppercase tracking-wider' style={{ color: 'var(--color-text-secondary)' }}>
                                    {tableColumnNames[k]}
                                </th>)}
                            </tr>
                        </thead>
                        <tbody style={{ backgroundColor: 'var(--color-dark-background)' }}>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className='px-6 py-4 text-center' style={{ color: 'var(--color-text-secondary)' }}>Cargando leads...</td>
                                </tr>
                            ) : leads?.length > 0 ? (
                                leads.map((lead) => (
                                    <>
                                        <tr
                                            key={lead.id}
                                            className='text-center border-b transition-colors duration-200'
                                            style={{ borderColor: 'var(--color-lighter-background)' }}
                                        >
                                            <td className='px-2 py-2 whitespace-nowrap text-sm font-medium'>
                                                <div className='flex items-center gap-2'>
                                                    {/* Ver Datos */}
                                                    <p>{lead.id}</p>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); toggleRowExpansion(lead.id); }}
                                                                className='text-white transition-colors cursor-pointer'
                                                            >
                                                                <Eye size={20} />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Ver datos</p>
                                                        </TooltipContent>
                                                    </Tooltip>

                                                    {/* Editar Lead */}
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={() => { handleEdit(lead) }}
                                                                className='text-yellow-200 transition-colors cursor-pointer'
                                                            >
                                                                <Edit size={20} />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Editar lead</p>
                                                        </TooltipContent>
                                                    </Tooltip>

                                                    {/* Copiar Data */}
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={() => navigator.clipboard.writeText(leadCopyContent(lead))}
                                                                className={`${(!lead.collected_data || JSON.stringify(lead.collected_data).length < 5) ? 'text-grey-400' : 'text-green-500 cursor-pointer'} transition-colors`}
                                                            >
                                                                <Copy size={20} />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Copiar data</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </td>
                                            <td className='px-6 py-4 text-sm max-w-xs overflow-hidden text-ellipsis' style={{ color: 'var(--color-light-text)' }}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className='whitespace-nowrap cursor-pointer'>
                                                            {lead.name
                                                                ? (lead.name.split(' ').length > 6
                                                                    ? lead.name.split(' ').slice(0, 6).join(' ') + '...'
                                                                    : lead.name)
                                                                : '-'}
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {/* El tooltip siempre muestra el nombre completo o 'N/A' */}
                                                        <p className='max-w-xs break-words'>{lead.name || 'N/A'}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </td>
                                            <td className='px-2 py-2 whitespace-nowrap text-sm'>{lead.is_active ? '🟢' : '🔴'}</td>
                                            <td className='px-2 py-2 whitespace-nowrap text-sm'>
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${statusOptions.find(s => s.value === lead.status)?.style || 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {statusOptions.find(s => s.value === lead.status)?.label}
                                                </span>
                                            </td>
                                            <td className='px-2 py-2 whitespace-nowrap text-sm'>{new Date(lead.created_at).toLocaleDateString()}</td>
                                        </tr>
                                        {expandedRows.includes(lead.id) && (
                                            <tr>
                                                <td colSpan={7} className='p-1 bg-gray-700'>
                                                    <div className='bg-gray-800 p-2'>
                                                        <div className='mt-1 grid grid-cols-1 md:grid-cols-2 gap-4'>
                                                            <div>
                                                                <h5 className='font-bold' style={{ color: 'var(--color-light-text)' }}>📑 Contacto</h5>
                                                                <ul className='space-y-2 text-sm' style={{ color: 'var(--color-text-secondary)' }}>
                                                                    {formatLeadDataForUI(lead).general}
                                                                </ul>
                                                            </div>
                                                            <div>
                                                                <h5 className='font-bold' style={{ color: 'var(--color-light-text)' }}>📑 Recolectado</h5>
                                                                {formatLeadDataForUI(lead).collected.length > 0 ? (
                                                                    <ul className='space-y-2 mt-2' style={{ color: 'var(--color-text-secondary)' }}>
                                                                        {formatLeadDataForUI(lead).collected}
                                                                    </ul>
                                                                ) : (
                                                                    <p className='text-sm mt-2' style={{ color: 'var(--color-text-secondary)' }}>No hay datos recopilados. 😕</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className='px-6 py-4 text-center' style={{ color: 'var(--color-text-secondary)' }}>No se encontraron leads. 🕵️‍♂️</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </TooltipProvider>
            </div>

            {/* Modal de edición */}
            {isModalOpen && (
                <EditLeadModal
                    lead={editingLead}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            )}

            {/* Paginación */}
            <div className='flex justify-between items-center mt-4'>
                <Button type='button' onClick={handlePrevPage} disabled={page === 0}>
                    Anterior
                </Button>
                <span className='text-sm' style={{ color: 'var(--color-text-secondary)' }}>Página {page + 1} de {Math.ceil(totalLeads / limit)}</span>
                <Button type='button' onClick={handleNextPage} disabled={(page + 1) * limit >= totalLeads}>
                    Siguiente
                </Button>
            </div>
        </div>
    );
};

export default DashboardPage;
