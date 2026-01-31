param sites_main_func_2_name string = 'main-func-2'
param serverfarms_EastUSPlan_name string = 'EastUSPlan'
param storageAccounts_docsofmaterial_name string = 'docsofmaterial'
param accounts_elayyanservice_name string = 'elayyanservice'
param searchServices_searchdocsofmaterial_name string = 'searchdocsofmaterial'

resource accounts_elayyanservice_name_resource 'Microsoft.CognitiveServices/accounts@2024-10-01' = {
  name: accounts_elayyanservice_name
  location: 'eastus'
  sku: {
    name: 'S0'
  }
  kind: 'OpenAI'
  properties: {
    apiProperties: {}
    customSubDomainName: accounts_elayyanservice_name
    networkAcls: {
      defaultAction: 'Allow'
      virtualNetworkRules: []
      ipRules: []
    }
    publicNetworkAccess: 'Enabled'
  }
}

resource searchServices_searchdocsofmaterial_name_resource 'Microsoft.Search/searchServices@2025-02-01-preview' = {
  name: searchServices_searchdocsofmaterial_name
  location: 'East US'
  tags: {
    ProjectType: 'aoai-your-data-service'
  }
  sku: {
    name: 'standard'
  }
  properties: {
    replicaCount: 1
    partitionCount: 1
    endpoint: 'https://${searchServices_searchdocsofmaterial_name}.search.windows.net'
    hostingMode: 'default'
    computeType: 'Default'
    publicNetworkAccess: 'Enabled'
    networkRuleSet: {
      ipRules: []
      bypass: 'None'
    }
    encryptionWithCmk: {
      enforcement: 'Unspecified'
    }
    disableLocalAuth: false
    authOptions: {
      apiKeyOnly: {}
    }
    disabledDataExfiltrationOptions: []
    semanticSearch: 'disabled'
  }
}

resource storageAccounts_docsofmaterial_name_resource 'Microsoft.Storage/storageAccounts@2024-01-01' = {
  name: storageAccounts_docsofmaterial_name
  location: 'eastus'
  tags: {
    ProjectType: 'aoai-your-data-service'
  }
  sku: {
    name: 'Standard_LRS'
    tier: 'Standard'
  }
  kind: 'StorageV2'
  properties: {
    defaultToOAuthAuthentication: false
    allowCrossTenantReplication: false
    minimumTlsVersion: 'TLS1_0'
    allowBlobPublicAccess: true
    allowSharedKeyAccess: true
    networkAcls: {
      bypass: 'AzureServices'
      virtualNetworkRules: []
      ipRules: []
      defaultAction: 'Allow'
    }
    supportsHttpsTrafficOnly: true
    encryption: {
      services: {
        file: {
          keyType: 'Account'
          enabled: true
        }
        blob: {
          keyType: 'Account'
          enabled: true
        }
      }
      keySource: 'Microsoft.Storage'
    }
    accessTier: 'Hot'
  }
}

resource serverfarms_EastUSPlan_name_resource 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: serverfarms_EastUSPlan_name
  location: 'East US'
  sku: {
    name: 'Y1'
    tier: 'Dynamic'
    size: 'Y1'
    family: 'Y'
    capacity: 0
  }
  kind: 'functionapp'
  properties: {
    perSiteScaling: false
    elasticScaleEnabled: false
    maximumElasticWorkerCount: 1
    isSpot: false
    reserved: false
    isXenon: false
    hyperV: false
    targetWorkerCount: 0
    targetWorkerSizeId: 0
    zoneRedundant: false
  }
}

resource accounts_elayyanservice_name_Default 'Microsoft.CognitiveServices/accounts/defenderForAISettings@2024-10-01' = {
  parent: accounts_elayyanservice_name_resource
  name: 'Default'
  properties: {
    state: 'Disabled'
  }
}

resource accounts_elayyanservice_name_gpt_35_turbo 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = {
  parent: accounts_elayyanservice_name_resource
  name: 'gpt-35-turbo'
  sku: {
    name: 'Standard'
    capacity: 100
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-35-turbo'
      version: '0125'
    }
    versionUpgradeOption: 'OnceNewDefaultVersionAvailable'
    currentCapacity: 100
    raiPolicyName: 'Microsoft.DefaultV2'
  }
}

resource accounts_elayyanservice_name_Microsoft_Default 'Microsoft.CognitiveServices/accounts/raiPolicies@2024-10-01' = {
  parent: accounts_elayyanservice_name_resource
  name: 'Microsoft.Default'
  properties: {
    mode: 'Blocking'
    contentFilters: [
      {
        name: 'Hate'
        severityThreshold: 'Medium'
        blocking: true
        enabled: true
        source: 'Prompt'
      }
      {
        name: 'Hate'
        severityThreshold: 'Medium'
        blocking: true
        enabled: true
        source: 'Completion'
      }
      {
        name: 'Sexual'
        severityThreshold: 'Medium'
        blocking: true
        enabled: true
        source: 'Prompt'
      }
      {
        name: 'Sexual'
        severityThreshold: 'Medium'
        blocking: true
        enabled: true
        source: 'Completion'
      }
      {
        name: 'Violence'
        severityThreshold: 'Medium'
        blocking: true
        enabled: true
        source: 'Prompt'
      }
      {
        name: 'Violence'
        severityThreshold: 'Medium'
        blocking: true
        enabled: true
        source: 'Completion'
      }
      {
        name: 'Selfharm'
        severityThreshold: 'Medium'
        blocking: true
        enabled: true
        source: 'Prompt'
      }
      {
        name: 'Selfharm'
        severityThreshold: 'Medium'
        blocking: true
        enabled: true
        source: 'Completion'
      }
    ]
  }
}

resource accounts_elayyanservice_name_Microsoft_DefaultV2 'Microsoft.CognitiveServices/accounts/raiPolicies@2024-10-01' = {
  parent: accounts_elayyanservice_name_resource
  name: 'Microsoft.DefaultV2'
  properties: {
    mode: 'Blocking'
    contentFilters: [
      {
        name: 'Hate'
        severityThreshold: 'Medium'
        blocking: true
        enabled: true
        source: 'Prompt'
      }
      {
        name: 'Hate'
        severityThreshold: 'Medium'
        blocking: true
        enabled: true
        source: 'Completion'
      }
      {
        name: 'Sexual'
        severityThreshold: 'Medium'
        blocking: true
        enabled: true
        source: 'Prompt'
      }
      {
        name: 'Sexual'
        severityThreshold: 'Medium'
        blocking: true
        enabled: true
        source: 'Completion'
      }
      {
        name: 'Violence'
        severityThreshold: 'Medium'
        blocking: true
        enabled: true
        source: 'Prompt'
      }
      {
        name: 'Violence'
        severityThreshold: 'Medium'
        blocking: true
        enabled: true
        source: 'Completion'
      }
      {
        name: 'Selfharm'
        severityThreshold: 'Medium'
        blocking: true
        enabled: true
        source: 'Prompt'
      }
      {
        name: 'Selfharm'
        severityThreshold: 'Medium'
        blocking: true
        enabled: true
        source: 'Completion'
      }
      {
        name: 'Jailbreak'
        blocking: true
        enabled: true
        source: 'Prompt'
      }
      {
        name: 'Protected Material Text'
        blocking: true
        enabled: true
        source: 'Completion'
      }
      {
        name: 'Protected Material Code'
        blocking: false
        enabled: true
        source: 'Completion'
      }
    ]
  }
}

resource storageAccounts_docsofmaterial_name_default 'Microsoft.Storage/storageAccounts/blobServices@2024-01-01' = {
  parent: storageAccounts_docsofmaterial_name_resource
  name: 'default'
  sku: {
    name: 'Standard_LRS'
    tier: 'Standard'
  }
  properties: {
    cors: {
      corsRules: []
    }
    deleteRetentionPolicy: {
      allowPermanentDelete: false
      enabled: false
    }
  }
}

resource Microsoft_Storage_storageAccounts_fileServices_storageAccounts_docsofmaterial_name_default 'Microsoft.Storage/storageAccounts/fileServices@2024-01-01' = {
  parent: storageAccounts_docsofmaterial_name_resource
  name: 'default'
  sku: {
    name: 'Standard_LRS'
    tier: 'Standard'
  }
  properties: {
    protocolSettings: {
      smb: {}
    }
    cors: {
      corsRules: []
    }
    shareDeleteRetentionPolicy: {
      enabled: true
      days: 7
    }
  }
}

resource Microsoft_Storage_storageAccounts_queueServices_storageAccounts_docsofmaterial_name_default 'Microsoft.Storage/storageAccounts/queueServices@2024-01-01' = {
  parent: storageAccounts_docsofmaterial_name_resource
  name: 'default'
  properties: {
    cors: {
      corsRules: []
    }
  }
}

resource Microsoft_Storage_storageAccounts_tableServices_storageAccounts_docsofmaterial_name_default 'Microsoft.Storage/storageAccounts/tableServices@2024-01-01' = {
  parent: storageAccounts_docsofmaterial_name_resource
  name: 'default'
  properties: {
    cors: {
      corsRules: []
    }
  }
}

resource sites_main_func_2_name_resource 'Microsoft.Web/sites@2024-04-01' = {
  name: sites_main_func_2_name
  location: 'East US'
  kind: 'functionapp'
  properties: {
    enabled: true
    hostNameSslStates: [
      {
        name: '${sites_main_func_2_name}.azurewebsites.net'
        sslState: 'Disabled'
        hostType: 'Standard'
      }
      {
        name: '${sites_main_func_2_name}.scm.azurewebsites.net'
        sslState: 'Disabled'
        hostType: 'Repository'
      }
    ]
    serverFarmId: serverfarms_EastUSPlan_name_resource.id
    reserved: false
    isXenon: false
    hyperV: false
    dnsConfiguration: {}
    vnetRouteAllEnabled: false
    vnetImagePullEnabled: false
    vnetContentShareEnabled: false
    siteConfig: {
      numberOfWorkers: 1
      acrUseManagedIdentityCreds: false
      alwaysOn: false
      http20Enabled: true
      functionAppScaleLimit: 200
      minimumElasticInstanceCount: 0
    }
    scmSiteAlsoStopped: false
    clientAffinityEnabled: false
    clientCertEnabled: false
    clientCertMode: 'Required'
    hostNamesDisabled: false
    ipMode: 'IPv4'
    vnetBackupRestoreEnabled: false
    customDomainVerificationId: '92F1F622CE11779A1FD9F46C3EE3AE07F1F058BCA42CD08EAD155BAB1BC2A29B'
    containerSize: 1536
    dailyMemoryTimeQuota: 0
    httpsOnly: false
    endToEndEncryptionEnabled: false
    redundancyMode: 'None'
    storageAccountRequired: false
    keyVaultReferenceIdentity: 'SystemAssigned'
  }
}

resource sites_main_func_2_name_ftp 'Microsoft.Web/sites/basicPublishingCredentialsPolicies@2024-04-01' = {
  parent: sites_main_func_2_name_resource
  name: 'ftp'
  location: 'East US'
  properties: {
    allow: true
  }
}

resource sites_main_func_2_name_scm 'Microsoft.Web/sites/basicPublishingCredentialsPolicies@2024-04-01' = {
  parent: sites_main_func_2_name_resource
  name: 'scm'
  location: 'East US'
  properties: {
    allow: true
  }
}

resource sites_main_func_2_name_web 'Microsoft.Web/sites/config@2024-04-01' = {
  parent: sites_main_func_2_name_resource
  name: 'web'
  location: 'East US'
  properties: {
    numberOfWorkers: 1
    defaultDocuments: [
      'Default.htm'
      'Default.html'
      'Default.asp'
      'index.htm'
      'index.html'
      'iisstart.htm'
      'default.aspx'
      'index.php'
    ]
    netFrameworkVersion: 'v4.0'
    requestTracingEnabled: false
    remoteDebuggingEnabled: false
    httpLoggingEnabled: false
    acrUseManagedIdentityCreds: false
    logsDirectorySizeLimit: 35
    detailedErrorLoggingEnabled: false
    publishingUsername: '$main-func-2'
    scmType: 'None'
    use32BitWorkerProcess: true
    webSocketsEnabled: false
    alwaysOn: false
    managedPipelineMode: 'Integrated'
    virtualApplications: [
      {
        virtualPath: '/'
        physicalPath: 'site\\wwwroot'
        preloadEnabled: false
      }
    ]
    loadBalancing: 'LeastRequests'
    experiments: {
      rampUpRules: []
    }
    autoHealEnabled: false
    vnetRouteAllEnabled: false
    vnetPrivatePortsCount: 0
    cors: {
      allowedOrigins: [
        'https://portal.azure.com'
      ]
      supportCredentials: true
    }
    localMySqlEnabled: false
    ipSecurityRestrictions: [
      {
        ipAddress: 'Any'
        action: 'Allow'
        priority: 2147483647
        name: 'Allow all'
        description: 'Allow all access'
      }
    ]
    scmIpSecurityRestrictions: [
      {
        ipAddress: 'Any'
        action: 'Allow'
        priority: 2147483647
        name: 'Allow all'
        description: 'Allow all access'
      }
    ]
    scmIpSecurityRestrictionsUseMain: false
    http20Enabled: true
    minTlsVersion: '1.2'
    scmMinTlsVersion: '1.2'
    ftpsState: 'FtpsOnly'
    preWarmedInstanceCount: 0
    functionAppScaleLimit: 200
    functionsRuntimeScaleMonitoringEnabled: false
    minimumElasticInstanceCount: 0
    azureStorageAccounts: {}
  }
}

resource sites_main_func_2_name_chunking_func 'Microsoft.Web/sites/functions@2024-04-01' = {
  parent: sites_main_func_2_name_resource
  name: 'chunking-func'
  location: 'East US'
  properties: {
    script_root_path_href: 'https://main-func-2.azurewebsites.net/admin/vfs/site/wwwroot/chunking-func/'
    script_href: 'https://main-func-2.azurewebsites.net/admin/vfs/site/wwwroot/chunking-func/index.js'
    config_href: 'https://main-func-2.azurewebsites.net/admin/vfs/site/wwwroot/chunking-func/function.json'
    test_data_href: 'https://main-func-2.azurewebsites.net/admin/vfs/data/Functions/sampledata/chunking-func.dat'
    href: 'https://main-func-2.azurewebsites.net/admin/functions/chunking-func'
    config: {
      bindings: [
        {
          authLevel: 'function'
          type: 'httpTrigger'
          direction: 'in'
          name: 'req'
          methods: [
            'get'
            'post'
          ]
        }
        {
          type: 'http'
          direction: 'out'
          name: 'res'
        }
      ]
    }
    test_data: '{"body":"{\\r\\n  \\"values\\": [\\r\\n    {\\r\\n      \\"recordId\\": \\"1\\",\\r\\n      \\"data\\": {\\r\\n        \\"content\\": \\"Azure Cognitive Search is a cloud search service that provides powerful full-text search, and it supports AI-powered indexing.\\\\n It allows developers to add search capabilities to applications without managing infrastructure.\\\\nThe service provides various features, including custom skillsets and entity recognition.\\",\\r\\n        \\"keyphrases\\": [\\"azure\\", \\"search\\"]\\r\\n      }\\r\\n    }\\r\\n  ]\\r\\n}","headers":[],"method":"post","queryStringParams":[]}'
    invoke_url_template: 'https://main-func-2.azurewebsites.net/api/chunking-func'
    language: 'node'
    isDisabled: false
  }
}

resource sites_main_func_2_name_sites_main_func_2_name_azurewebsites_net 'Microsoft.Web/sites/hostNameBindings@2024-04-01' = {
  parent: sites_main_func_2_name_resource
  name: '${sites_main_func_2_name}.azurewebsites.net'
  location: 'East US'
  properties: {
    siteName: 'main-func-2'
    hostNameType: 'Verified'
  }
}

resource storageAccounts_docsofmaterial_name_default_azure_webjobs_hosts 'Microsoft.Storage/storageAccounts/blobServices/containers@2024-01-01' = {
  parent: storageAccounts_docsofmaterial_name_default
  name: 'azure-webjobs-hosts'
  properties: {
    immutableStorageWithVersioning: {
      enabled: false
    }
    defaultEncryptionScope: '$account-encryption-key'
    denyEncryptionScopeOverride: false
    publicAccess: 'None'
  }
  dependsOn: [
    storageAccounts_docsofmaterial_name_resource
  ]
}

resource storageAccounts_docsofmaterial_name_default_azure_webjobs_secrets 'Microsoft.Storage/storageAccounts/blobServices/containers@2024-01-01' = {
  parent: storageAccounts_docsofmaterial_name_default
  name: 'azure-webjobs-secrets'
  properties: {
    immutableStorageWithVersioning: {
      enabled: false
    }
    defaultEncryptionScope: '$account-encryption-key'
    denyEncryptionScopeOverride: false
    publicAccess: 'None'
  }
  dependsOn: [
    storageAccounts_docsofmaterial_name_resource
  ]
}

resource storageAccounts_docsofmaterial_name_default_ms_az_cognitive_search_debugsession 'Microsoft.Storage/storageAccounts/blobServices/containers@2024-01-01' = {
  parent: storageAccounts_docsofmaterial_name_default
  name: 'ms-az-cognitive-search-debugsession'
  properties: {
    immutableStorageWithVersioning: {
      enabled: false
    }
    defaultEncryptionScope: '$account-encryption-key'
    denyEncryptionScopeOverride: false
    publicAccess: 'None'
  }
  dependsOn: [
    storageAccounts_docsofmaterial_name_resource
  ]
}

resource storageAccounts_docsofmaterial_name_default_testing_material 'Microsoft.Storage/storageAccounts/blobServices/containers@2024-01-01' = {
  parent: storageAccounts_docsofmaterial_name_default
  name: 'testing-material'
  properties: {
    immutableStorageWithVersioning: {
      enabled: false
    }
    defaultEncryptionScope: '$account-encryption-key'
    denyEncryptionScopeOverride: false
    publicAccess: 'Blob'
  }
  dependsOn: [
    storageAccounts_docsofmaterial_name_resource
  ]
}

resource storageAccounts_docsofmaterial_name_default_main_func_258c25471669d 'Microsoft.Storage/storageAccounts/fileServices/shares@2024-01-01' = {
  parent: Microsoft_Storage_storageAccounts_fileServices_storageAccounts_docsofmaterial_name_default
  name: 'main-func-258c25471669d'
  properties: {
    accessTier: 'TransactionOptimized'
    shareQuota: 102400
    enabledProtocols: 'SMB'
  }
  dependsOn: [
    storageAccounts_docsofmaterial_name_resource
  ]
}

resource storageAccounts_docsofmaterial_name_default_main_function_quiz_gen24b45e986136 'Microsoft.Storage/storageAccounts/fileServices/shares@2024-01-01' = {
  parent: Microsoft_Storage_storageAccounts_fileServices_storageAccounts_docsofmaterial_name_default
  name: 'main-function-quiz-gen24b45e986136'
  properties: {
    accessTier: 'TransactionOptimized'
    shareQuota: 102400
    enabledProtocols: 'SMB'
  }
  dependsOn: [
    storageAccounts_docsofmaterial_name_resource
  ]
}

resource storageAccounts_docsofmaterial_name_default_AzureFunctionsDiagnosticEvents202504 'Microsoft.Storage/storageAccounts/tableServices/tables@2024-01-01' = {
  parent: Microsoft_Storage_storageAccounts_tableServices_storageAccounts_docsofmaterial_name_default
  name: 'AzureFunctionsDiagnosticEvents202504'
  properties: {}
  dependsOn: [
    storageAccounts_docsofmaterial_name_resource
  ]
}
