
@description('Generated from /subscriptions/eb1e93fc-5a8d-4bec-ae14-d90a4ca929c8/resourceGroups/SecondChair/providers/Microsoft.Web/staticSites/SecondChairClient')
resource SecondChairClient 'Microsoft.Web/staticSites@2023-12-01' = {
  name: 'SecondChairClient'
  location: 'East US 2'
  tags: {}
  properties: {
    repositoryUrl: 'https://github.com/bartsides/second-chair'
    branch: 'main'
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    provider: 'GitHub'
    enterpriseGradeCdnStatus: 'Disabled'
    publicNetworkAccess: null
  }
  sku: {
    name: 'Free'
    tier: 'Free'
  }
}
