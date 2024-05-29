param name string
@allowed(['eastus', 'eastus2', 'centralus'])
param location string
@allowed(['Free'])
param sku string = 'Free'

resource spa_resource 'Microsoft.Web/staticSites@2023-12-01' = {
  name: name
  location: location
  tags: null
  properties: {}
  sku: {
    name: sku
    size: sku
  }
}
