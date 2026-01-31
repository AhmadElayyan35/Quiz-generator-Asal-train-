# 🚀 Azure Deployment Toolkit

This project automates the export, import, and deployment of a complete Azure-based system including:

- 🔍 **Azure Cognitive Search** components (Index, Indexer, Datasource, Skillset)
- 📦 **Azure Blob Storage** files
- ⚙️ **Azure Function App** used for our custom AI skill (`chunking-func`)

Everything is driven by Python and controlled via environment variables and configuration files.

---

## 🔐 .env — Private Credentials

The `.env` file stores secrets and credentials. Example:

```env
# Azure Search API Key
AZURE_SEARCH_API_KEY=your-api-key

# Azure Blob Storage connection string
AZURE_STORAGE_CONN=DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;EndpointSuffix=core.windows.net

# Azure Function publish credentials
PUBLISH_PROFILE_USER=your-username
PUBLISH_PROFILE_PASS=your-password

AZURE_ACCESS_TOKEN=
```

🛑 **Do not commit this file to version control!** It’s listed in `.gitignore`.

---

## ⚙️ config.py — Project Settings

Edit `config.py` to configure your deployment:

```python
INDEX_NAME = "main-index"
INDEXER_NAME = 'main-indexer'
SKILLSET_NAME = 'azureblob-skillset'
DATASOURCE_NAME = 'quizcontentstorage'

SEARCH_NAME = "searchdocsofmaterial"
API_VERSION = "2021-04-30-Preview"
CONTAINER_NAME = "testing-material"
FUNCTION_APP_NAME = "main-func-2"
ZIP_DIR_PATH = "chunking-func"
ZIP_FILE_PATH = "chunking-func.zip"
COMPONENTS_FOLDER = "exported_components"
BLOBS_FOLDER = "downloaded_blobs"

COMPONENTS = {
    "indexes": "main-index",
    "indexers": "main-indexer",
    "skillsets": "azureblob-skillset",
    "datasources": "quizcontentstorage",
}
```

---

## 📦 Setup & Installation

1. Clone the repo
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # or source venv/bin/activate on Linux/macOS
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create your `.env` file with the necessary secrets

---

## 🚀 Usage

### ✅ Export All

```bash
python export_all.py
```

- Exports search components to `imported_components/`
- Downloads all blobs to `downloaded_blobs/`

### ✅ Import & Deploy

```bash
python import_all.py
```

- Recreates the index, indexer, skillset, and datasource
- Creates blob container
- Zips and deploys the Azure Function App

---

## 🧠 Notes

- The Function App code must be inside the `chunking-func/` folder
- `chunking-func.zip` is automatically generated and removed post-deployment
- You can manually control which components to export/import in `config.py`
- The toolkit supports reproducible infrastructure for testing and production
