export interface IUser {
    id: string,
    username: string,
    password: string,
}

export interface IUserForm {
    password: string;
    username: string;
}

export interface ILead {
    id: string,
    name: string,
    is_active: boolean,
    status: string,
    created_at: string,
    collected_data: null | Record<string, string>
}

export interface ILeadUpdate {
    id: string;
    name: string;
    is_active: boolean;
    status: string;
}