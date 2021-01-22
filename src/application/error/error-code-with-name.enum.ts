export enum ErrorCodeWithName {
    err1000 = 'UniqueKeyConstraintViolation',

    // 2xxx - business rule errors
    err2000 = 'ActionDeniedUserSoftDeleted',
    err2001 = 'ActionDeniedConsultEmailAccount',
}
