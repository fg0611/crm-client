export interface IUser {
    id: string,
    email: string,
    password: string,

}

export interface ILead {
    id: string,
    name: string,
    is_active: boolean,
    status: string,
    created_at: string,
    collected_data: null | object
}