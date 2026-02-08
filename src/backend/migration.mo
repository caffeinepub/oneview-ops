import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  type OldActor = {
    organizations : Map.Map<Principal, OldOrganization>;
    systemUserRecords : Map.Map<Principal, OldSystemUserRecord>;
    userMappings : Map.Map<Principal, OldUserMapping>;
    timesheetRecords : Map.Map<Principal, OldTimesheetRecord>;
    alerts : Map.Map<Principal, OldAlert>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  type OldOrganization = {
    principal : Principal;
    name : Text;
    orgType : OrganizationType;
    integrations : [OldIntegration];
  };

  type OldSystemUserRecord = {
    organization : Principal;
    integrationId : Text;
    email : Text;
    name : Text;
    integrationType : IntegrationType;
  };

  type OldUserMapping = {
    canisterUser : Principal;
    loxoUserId : ?Text;
    aircallUserId : ?Text;
    timesheetUserId : ?Text;
  };

  type OldTimesheetRecord = {
    organization : Principal;
    userId : Text;
    date : Int;
    hours : Float;
    billable : Bool;
  };

  type OldAlert = {
    id : Nat;
    user : Principal;
    message : Text;
    acknowledged : Bool;
  };

  type OldUserProfile = {
    name : Text;
    email : ?Text;
    organizationId : ?Principal;
  };

  type OrganizationType = {
    #staffing;
    #internalTA;
  };

  type IntegrationType = {
    #loxo;
    #aircall;
    #timesheets;
  };

  type OldIntegration = {
    id : IntegrationType;
    apiKey : ?Text;
    connected : Bool;
  };

  public type NewActor = {
    organizations : Map.Map<Principal, OldOrganization>;
    systemUserRecords : Map.Map<Principal, OldSystemUserRecord>;
    userMappings : Map.Map<Principal, OldUserMapping>;
    timesheetRecords : Map.Map<Principal, OldTimesheetRecord>;
    alerts : Map.Map<Principal, OldAlert>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    dashboards : Map.Map<Nat, NewDashboard>;
    nextDashboardId : Nat;
    nextWidgetId : Nat;
  };

  public type NewDashboard = {
    id : Nat;
    name : Text;
    widgets : [NewWidget];
    owner : Principal;
  };

  public type NewWidget = {
    id : Nat;
    widgetType : WidgetType;
    config : Text;
  };

  public type WidgetType = {
    #kpiCard;
    #trendChart;
    #table;
  };

  public func run(old : OldActor) : NewActor {
    { old with
      dashboards = Map.empty<Nat, NewDashboard>();
      nextDashboardId = 1;
      nextWidgetId = 1;
    };
  };
};
