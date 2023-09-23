export type ServiceResponse = {
    ok: boolean;
    message: string;
};

export type ServiceError = {
    error: string;
    message: any;
};

export type FieldError = {
    code: string;
    minimum: number;
    type: string;
    inclusive: boolean;
    exact: boolean;
    message: string;
    path: string[];
};

export function formatFieldError(errors: FieldError[]) {
    return errors.map((e) => `${e.path[0]}: ${e.message}`).join(", ");
}
