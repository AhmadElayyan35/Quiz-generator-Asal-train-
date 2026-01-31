import * as React from "react";
import {
  EyeRegular,
  DeleteRegular,
} from "@fluentui/react-icons";
import {
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHeaderCell,
  TableCellLayout,
  Button,
  Input,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  Text,
  CardFooter,
} from "@fluentui/react-components";
import { Link, Spinner, SpinnerSize } from "@fluentui/react";
import { Pagination } from "./Pagination";
import { ActionsCell, Container, ErrorText, FailToast, Header, StyledCard, SuccessToast, Toolbar } from "./Categories.styles";
import { GetAllCategories } from "../../APIs/Categories/GetAllCategories";
import { DeleteCategory } from "../../APIs/Categories/DeleteCategory";
import { AddCategory } from "../../APIs/Categories/AddCategory";
import LoadingDialog from "../Category/LoadingDialog";
import { useToastController, Toaster } from '@fluentui/react-components';
import BackContainer from "../BackContainer";
import { useApi } from "../../hooks/useApi";


export type Category = {
  id: number;
  name: string;
};


export const Categories = () => {
  const [newCategoryName, setNewCategoryName] = React.useState("");
  const [categoriesList, setCategoriesList] = React.useState<Category[]>([])
  const [error, setError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(true);
  const [loadingDialog, setLoadingDialog] = React.useState<boolean>(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filteredCategories, setFilteredCategories] = React.useState<Category[]>([])
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage
  const end = currentPage * itemsPerPage
  const { dispatchToast } = useToastController();
  const apiFetch = useApi()

  React.useEffect(() => {
    GetAllCategories(apiFetch, setCategoriesList)
      .then((data) => {
        setFilteredCategories(data.categories)
      })
      .finally(() => {
        setLoading(false);
      })
  }, []);

  React.useEffect(() => {
    if (newCategoryName) {
      if (newCategoryName.length < 3) {
        setError("Category name must be at least 3 characters long.");
      }
      else if (newCategoryName.length > 20) {
        setError("Category name must be at most 20 characters long.");
      }
      else {
        setError("");
      }
    }
  }, [newCategoryName])

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim() === '') {
        setFilteredCategories(categoriesList);
      } else {
        const filtered = categoriesList.filter(cat =>
          cat.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCategories(filtered);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);



  const handleDeleteCategory = async (id: number) => {
    setLoadingDialog(true);
    try {
      await DeleteCategory(apiFetch, id)
      dispatchToast(
        <SuccessToast>Category Deleted successfully!</SuccessToast>,
        {
          position: 'bottom-end',
          intent: 'success',
        }
      );
    } catch (error) {
      dispatchToast(
        <FailToast>Failed to delete category</FailToast>,
        {
          position: 'bottom-end',
          intent: 'error'
        }
      );
    }
    finally {
      setLoadingDialog(false);
    }
    setLoading(true);
    await GetAllCategories(apiFetch, setCategoriesList)
      .then((data) => {
        setFilteredCategories(data.categories)
      })
      .finally(() => {
        setLoading(false);
      })
  };
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setNewCategoryName("");
    setAddDialogOpen(false);
    setLoadingDialog(true);
    try {
      await AddCategory(apiFetch, newCategoryName);
      dispatchToast(
        <SuccessToast>Category added successfully!</SuccessToast>,
        {
          position: 'bottom-end',
          intent: 'success',

        }
      );
    } catch (error) {
      dispatchToast(
        <FailToast>Failed to add category</FailToast>,
        {
          position: 'bottom-end',
          intent: 'error'
        }
      );
    } finally {
      setLoadingDialog(false);
    }

    setLoading(true);
    await GetAllCategories(apiFetch, setCategoriesList)
      .then((data) => {
        setFilteredCategories(data.categories)
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container>
      <BackContainer />
      <Header>
        <Text weight="bold" size={700}>Categories</Text>
      </Header>

      <Toolbar>
        <Input
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />
        <Button appearance="primary" onClick={() => setAddDialogOpen(true)}>
          + Add Category
        </Button>
      </Toolbar>

      <StyledCard>

        {loading ? (
          <Spinner label="Loading categories..." size={SpinnerSize.medium} />
        ) : filteredCategories.length === 0 ? (
          <Text>No categories found.</Text>
        ) : (
          <Table aria-label="Styled categories table" style={{ width: "100%" }}>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Category</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.slice(start, end).map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <TableCellLayout>
                      <strong>{category.name}</strong>
                    </TableCellLayout>
                  </TableCell>

                  <TableCell>
                    <ActionsCell>
                      <Link href={`/categories/${category.id}`}>
                        <Button size="small" icon={<EyeRegular />} appearance="secondary">
                          View
                        </Button>
                      </Link>
                      <Button
                        size="small"
                        icon={<DeleteRegular />}
                        appearance="subtle"
                        color="danger"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        Delete
                      </Button>
                    </ActionsCell>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <CardFooter>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
        </CardFooter>
      </StyledCard>
      {loadingDialog && <LoadingDialog loadingDialog={loadingDialog} />}
      <Dialog open={addDialogOpen} onOpenChange={(_, data) => setAddDialogOpen(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogContent>
              <Input
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                style={{ marginBottom: 12 }}
              />
              {error && <ErrorText>{error}</ErrorText>}
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button disabled={newCategoryName.length < 3} appearance="primary" onClick={handleAddCategory}>
                Add
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
      <Toaster />
    </Container>
  );
};
