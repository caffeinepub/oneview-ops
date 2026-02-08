import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Organization {
    principal: Principal;
    integrations: Array<Integration>;
    orgType: OrganizationType;
    name: string;
}
export type Time = bigint;
export interface Widget {
    id: bigint;
    widgetType: WidgetType;
    config: string;
}
export interface SystemUserRecord {
    name: string;
    integrationId: string;
    email: string;
    integrationType: IntegrationType;
    organization: Principal;
}
export interface UserMapping {
    timesheetUserId?: string;
    canisterUser: Principal;
    aircallUserId?: string;
    loxoUserId?: string;
}
export interface Integration {
    id: IntegrationType;
    apiKey?: string;
    connected: boolean;
}
export interface Dashboard {
    id: bigint;
    widgets: Array<Widget>;
    owner: Principal;
    name: string;
}
export interface Alert {
    id: bigint;
    user: Principal;
    acknowledged: boolean;
    message: string;
}
export interface TimesheetRecord {
    hours: number;
    userId: string;
    date: Time;
    billable: boolean;
    organization: Principal;
}
export interface UserProfile {
    organizationId?: Principal;
    name: string;
    email?: string;
}
export enum IntegrationType {
    loxo = "loxo",
    timesheets = "timesheets",
    aircall = "aircall"
}
export enum OrganizationType {
    internalTA = "internalTA",
    staffing = "staffing"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum WidgetType {
    table = "table",
    trendChart = "trendChart",
    kpiCard = "kpiCard"
}
export interface backendInterface {
    acknowledgeAlert(alertId: Principal): Promise<void>;
    addAlert(alert: Alert): Promise<void>;
    addOrganization(name: string, orgType: OrganizationType): Promise<void>;
    addSystemUserRecord(record: SystemUserRecord): Promise<void>;
    addTimesheetRecord(record: TimesheetRecord): Promise<void>;
    addUserMapping(mapping: UserMapping): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createDashboard(name: string, widgets: Array<Widget>): Promise<bigint>;
    getAlert(id: Principal): Promise<Alert>;
    getAllAlerts(): Promise<Array<Alert>>;
    getAllDashboards(): Promise<Array<Dashboard>>;
    getAllOrganizations(): Promise<Array<Organization>>;
    getAllTimesheetRecords(): Promise<Array<TimesheetRecord>>;
    getAllUserMappings(): Promise<Array<UserMapping>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboard(dashboardId: bigint): Promise<Dashboard>;
    getOrganization(id: Principal): Promise<Organization>;
    getSystemUserRecordsByIntegration(integrationId: string): Promise<Array<SystemUserRecord>>;
    getTimesheetRecord(id: Principal): Promise<TimesheetRecord>;
    getUserMapping(id: Principal): Promise<UserMapping>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateDashboard(dashboardId: bigint, name: string, widgets: Array<Widget>): Promise<void>;
    updateIntegration(orgId: Principal, integration: Integration): Promise<void>;
}
