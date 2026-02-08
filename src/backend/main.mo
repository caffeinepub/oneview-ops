import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Option "mo:core/Option";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  // System State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type OrganizationType = {
    #staffing;
    #internalTA;
  };

  type IntegrationType = {
    #loxo;
    #aircall;
    #timesheets;
  };

  module IntegrationType {
    public func toText(integrationType : IntegrationType) : Text {
      switch (integrationType) {
        case (#loxo) { "Loxo" };
        case (#aircall) { "Aircall" };
        case (#timesheets) { "Timesheets" };
      };
    };
  };

  type Integration = {
    id : IntegrationType;
    apiKey : ?Text;
    connected : Bool;
  };

  module Integration {
    public func compare(integration1 : Integration, integration2 : Integration) : Order.Order {
      switch (integration1.id, integration2.id) {
        case (#loxo, #loxo) { integration1.apiKey.compare(integration2.apiKey) };
        case (#loxo, _) { #less };
        case (#aircall, #aircall) { integration1.apiKey.compare(integration2.apiKey) };
        case (#aircall, #loxo) { #greater };
        case (#aircall, #timesheets) { #less };
        case (#timesheets, #timesheets) {
          integration1.apiKey.compare(integration2.apiKey);
        };
        case (#timesheets, _) { #greater };
      };
    };
  };

  type Organization = {
    principal : Principal;
    name : Text;
    orgType : OrganizationType;
    integrations : [Integration];
  };

  // System User Record
  module SystemUserRecord {
    public func compareByIntegrationId(record1 : SystemUserRecord, record2 : SystemUserRecord) : Order.Order {
      switch (Principal.compare(record1.organization, record2.organization)) {
        case (#equal) { Text.compare(record1.integrationId, record2.integrationId) };
        case (order) { order };
      };
    };
  };

  type SystemUserRecord = {
    organization : Principal;
    integrationId : Text;
    email : Text;
    name : Text;
    integrationType : IntegrationType;
  };

  // User Mapping
  type UserMapping = {
    canisterUser : Principal;
    loxoUserId : ?Text;
    aircallUserId : ?Text;
    timesheetUserId : ?Text;
  };

  // Timesheet Data
  type TimesheetRecord = {
    organization : Principal;
    userId : Text;
    date : Time.Time;
    hours : Float;
    billable : Bool;
  };

  // Alert Entity
  type Alert = {
    id : Nat;
    user : Principal;
    message : Text;
    acknowledged : Bool;
  };

  module Alert {
    public func compare(alert1 : Alert, alert2 : Alert) : Order.Order {
      switch (Principal.compare(alert1.user, alert2.user)) {
        case (#equal) { Text.compare(alert1.message, alert2.message) };
        case (order) { order };
      };
    };
  };

  // User Profile
  public type UserProfile = {
    name : Text;
    email : ?Text;
    organizationId : ?Principal;
  };

  // Dashboard Management
  public type WidgetType = {
    #kpiCard;
    #trendChart;
    #table;
  };

  public type Widget = {
    id : Nat;
    widgetType : WidgetType;
    config : Text; // JSON string with config details
  };

  public type Dashboard = {
    id : Nat;
    name : Text;
    widgets : [Widget];
    owner : Principal;
  };

  let dashboards = Map.empty<Nat, Dashboard>();
  var nextDashboardId : Nat = 1;
  var nextWidgetId : Nat = 1;

  // Core Model State
  let organizations = Map.empty<Principal, Organization>();
  let systemUserRecords = Map.empty<Principal, SystemUserRecord>();
  let userMappings = Map.empty<Principal, UserMapping>();
  let timesheetRecords = Map.empty<Principal, TimesheetRecord>();
  let alerts = Map.empty<Principal, Alert>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management (Required by Frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Dashboard Management Functions
  public shared ({ caller }) func createDashboard(name : Text, widgets : [Widget]) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create dashboards");
    };

    let dashboardId = nextDashboardId;
    nextDashboardId += 1;

    let processedWidgets = Array.tabulate(
      widgets.size(),
      func(i) {
        let w = widgets[i];
        { w with id = nextWidgetId + i };
      },
    );
    nextWidgetId += widgets.size();

    let dashboard : Dashboard = {
      id = dashboardId;
      name;
      widgets = processedWidgets;
      owner = caller;
    };

    dashboards.add(dashboardId, dashboard);
    dashboardId;
  };

  public shared ({ caller }) func updateDashboard(dashboardId : Nat, name : Text, widgets : [Widget]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update dashboards");
    };

    let dashboard = getDashboardUnsafe(dashboardId);
    verifyOwnerUnsafe(caller, dashboard.owner);

    let processedWidgets = Array.tabulate(
      widgets.size(),
      func(i) {
        let w = widgets[i];
        { w with id = nextWidgetId + i };
      },
    );
    nextWidgetId += widgets.size();

    let updatedDashboard : Dashboard = {
      id = dashboard.id;
      name;
      widgets = processedWidgets;
      owner = dashboard.owner;
    };

    dashboards.add(dashboardId, updatedDashboard);
  };

  public query ({ caller }) func getDashboard(dashboardId : Nat) : async Dashboard {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view dashboards");
    };

    let dashboard = getDashboardUnsafe(dashboardId);
    verifyAdminOrSelfUnsafe(caller, dashboard.owner);
    dashboard;
  };

  public query ({ caller }) func getAllDashboards() : async [Dashboard] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view dashboards");
    };

    if (AccessControl.isAdmin(accessControlState, caller)) {
      dashboards.values().toArray();
    } else {
      dashboards.values().toArray().filter(func(dashboard) { dashboard.owner == caller });
    };
  };

  // Organization Management (Admin-only)
  public shared ({ caller }) func addOrganization(name : Text, orgType : OrganizationType) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add organizations");
    };
    let org : Organization = {
      principal = caller;
      name;
      orgType;
      integrations = [];
    };
    organizations.add(caller, org);
  };

  public shared ({ caller }) func updateIntegration(orgId : Principal, integration : Integration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update integrations");
    };
    let org = getOrganizationUnsafe(orgId);
    let newIntegrations = org.integrations.concat([integration]);
    organizationIntegrationCheckUnsafe(org.integrations, integration);
    let updatedOrg : Organization = {
      principal = org.principal;
      name = org.name;
      orgType = org.orgType;
      integrations = newIntegrations;
    };
    organizations.add(orgId, updatedOrg);
  };

  public query ({ caller }) func getOrganization(id : Principal) : async Organization {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view organizations");
    };
    getOrganizationUnsafe(id);
  };

  public query ({ caller }) func getAllOrganizations() : async [Organization] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view organizations");
    };
    organizations.values().toArray();
  };

  // System User Records (Admin-only write, User read)
  public shared ({ caller }) func addSystemUserRecord(record : SystemUserRecord) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add system user records");
    };
    systemUserRecords.add(caller, record);
  };

  public query ({ caller }) func getSystemUserRecordsByIntegration(integrationId : Text) : async [SystemUserRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view system user records");
    };
    systemUserRecords.values().toArray().filter(func(record) { record.integrationId == integrationId }).sort(SystemUserRecord.compareByIntegrationId);
  };

  // User Mappings (Admin or self)
  public shared ({ caller }) func addUserMapping(mapping : UserMapping) : async () {
    verifyAdminOrSelfUnsafe(caller, mapping.canisterUser);
    userMappings.add(mapping.canisterUser, mapping);
  };

  public query ({ caller }) func getUserMapping(id : Principal) : async UserMapping {
    verifyAdminOrSelfUnsafe(caller, id);
    getUserMappingsUnsafe(id);
  };

  public query ({ caller }) func getAllUserMappings() : async [UserMapping] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all user mappings");
    };
    userMappings.values().toArray();
  };

  // Timesheets (Admin or organization owner)
  public shared ({ caller }) func addTimesheetRecord(record : TimesheetRecord) : async () {
    verifyAdminOrSelfUnsafe(caller, record.organization);
    timesheetRecords.add(caller, record);
  };

  public query ({ caller }) func getTimesheetRecord(id : Principal) : async TimesheetRecord {
    let record = getTimesheetRecordUnsafe(id);
    verifyAdminOrSelfUnsafe(caller, record.organization);
    record;
  };

  public query ({ caller }) func getAllTimesheetRecords() : async [TimesheetRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all timesheet records");
    };
    timesheetRecords.values().toArray();
  };

  // Alerts (Owner only for write, admin or owner for read)
  public shared ({ caller }) func addAlert(alert : Alert) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add alerts");
    };
    verifyOwnerUnsafe(caller, alert.user);
    alerts.add(caller, alert);
  };

  public shared ({ caller }) func acknowledgeAlert(alertId : Principal) : async () {
    let alert = getAlertUnsafe(alertId);
    verifyOwnerUnsafe(caller, alert.user);
    let updatedAlert = { alert with acknowledged = true };
    alerts.add(alertId, updatedAlert);
  };

  public query ({ caller }) func getAlert(id : Principal) : async Alert {
    let alert = getAlertUnsafe(id);
    verifyAdminOrSelfUnsafe(caller, alert.user);
    alert;
  };

  public query ({ caller }) func getAllAlerts() : async [Alert] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view alerts");
    };
    if (AccessControl.isAdmin(accessControlState, caller)) {
      alerts.values().toArray().sort();
    } else {
      alerts.values().toArray().filter(func(alert) { alert.user == caller }).sort();
    };
  };

  /////////////////////
  // Helper Functions //
  /////////////////////
  func organizationIntegrationCheckUnsafe(integrations : [Integration], integration : Integration) {
    if (integrations.filter(func(integration2) { integration2.id == integration.id }).size() > 0) {
      Runtime.trap("Integration with type already exists: " # IntegrationType.toText(integration.id));
    };
  };

  // Security Checks
  func verifyAdminOrSelfUnsafe(requester : Principal, resourceOwner : Principal) {
    if (requester == resourceOwner) {
      return;
    };
    if (AccessControl.isAdmin(accessControlState, requester)) {
      return;
    };
    Runtime.trap("Unauthorized: Can only access your own resource");
  };

  func verifyOwnerUnsafe(requester : Principal, resourceOwner : Principal) {
    if (not (requester == resourceOwner)) {
      Runtime.trap("Unauthorized: Can only access your own resource");
    };
  };

  // Optional Value Extractors
  func getOrganizationUnsafe(id : Principal) : Organization = switch (organizations.get(id)) {
    case (null) { Runtime.trap("Organization not found : " # id.toText()) };
    case (?org) { org };
  };

  func getUserMappingsUnsafe(id : Principal) : UserMapping = switch (userMappings.get(id)) {
    case (null) { Runtime.trap("User mapping not found : " # id.toText()) };
    case (?mapping) { mapping };
  };

  func getTimesheetRecordUnsafe(id : Principal) : TimesheetRecord = switch (timesheetRecords.get(id)) {
    case (null) { Runtime.trap("Timesheet record not found : " # id.toText()) };
    case (?record) { record };
  };

  func getAlertUnsafe(id : Principal) : Alert = switch (alerts.get(id)) {
    case (null) { Runtime.trap("Alert not found : " # id.toText()) };
    case (?alert) { alert };
  };

  func getDashboardUnsafe(id : Nat) : Dashboard = switch (dashboards.get(id)) {
    case (null) { Runtime.trap("Dashboard not found : " # Nat.toText(id)) };
    case (?dashboard) { dashboard };
  };
};
