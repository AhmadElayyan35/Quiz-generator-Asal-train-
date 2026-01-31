from tool_blob import create_blob_container
from tool_datasource import import_datasource
from tool_function import deploy_function_app, zip_function_code
from tool_index import import_index
from tool_indexer import import_indexer
from tool_skillset import import_skillset

import_index()
import_skillset()
import_indexer()
import_datasource()
create_blob_container()
zip_function_code()
deploy_function_app()
