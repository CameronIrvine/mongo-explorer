enum Commands {
  CloseWindow = 'CloseWindow',
  MinimizeWindow = 'MinimizeWindow',
  WriteCredential = 'WriteCredential',
  DeleteCredential = 'DeleteCredential',
  GetAllCredentials = 'GetAllCredentials',
  ConnectToCluster = 'ConnectToCluster',
  DisconnectFromCluster = 'DisconnectFromCluster',
  GetDatabases = 'GetDatabases',
  GetCollections = 'GetCollections',
  GetDocuments = 'GetDocuments'
}

export default Commands;